/**
 * URL assinada do R2 (AWS SigV4, query string).
 *
 * O bucket é privado: o endpoint da API S3 recusa qualquer GET sem assinatura.
 * Antes daqui o backend redirecionava o atleta para a URL crua do objeto, que
 * responde 400 — o link de mídia protegia o nosso lado e morria no último salto.
 *
 * Feito com `crypto` da própria plataforma, de propósito: entrar com o SDK da
 * AWS por causa de uma assinatura seria trocar 60 linhas legíveis por uma
 * árvore de dependências que ninguém audita antes do evento.
 */
import { createHash, createHmac } from 'node:crypto';
import { config, r2Configurado } from '../config.js';

/** R2 não tem região de verdade; a assinatura exige uma, e é sempre `auto`. */
const REGIAO = process.env.R2_REGION ?? 'auto';
const SERVICO = 's3';
const ALGORITMO = 'AWS4-HMAC-SHA256';
/** Teto do SigV4 por query string. */
const TTL_MAXIMO = 7 * 24 * 3600;

const sha256 = (v: string) => createHash('sha256').update(v, 'utf8').digest('hex');
const hmac = (chave: Buffer | string, v: string) => createHmac('sha256', chave).update(v, 'utf8').digest();

/**
 * `encodeURIComponent` não escapa `!'()*`, que a AWS exige escapados — e a
 * assinatura confere byte a byte, então a diferença vira 403.
 */
function encodar(valor: string): string {
  return encodeURIComponent(valor).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/** Cada segmento é escapado; as barras continuam sendo barras. */
function encodarCaminho(caminho: string): string {
  return caminho.split('/').map(encodar).join('/');
}

function carimbos(agora: Date) {
  const iso = agora.toISOString().replace(/[:-]|\.\d{3}/g, ''); // 20260904T185200Z
  return { dataHora: iso, data: iso.slice(0, 8) };
}

/**
 * Assina uma URL de objeto do R2. `metodo` é GET para assistir e PUT para
 * subir; a assinatura é a mesma, muda só o verbo canônico.
 */
export function assinarUrlR2(
  objectKey: string,
  {
    metodo = 'GET',
    ttl = config.mediaTtlSegundos,
    baixarComo,
  }: { metodo?: string; ttl?: number; baixarComo?: string } = {},
): string | null {
  if (!r2Configurado() || !objectKey) return null;

  const endpoint = new URL(config.r2Endpoint);
  const host = endpoint.host;
  const caminho = `/${encodarCaminho(`${config.r2Bucket}/${objectKey}`)}`;
  const { dataHora, data } = carimbos(new Date());
  const escopo = `${data}/${REGIAO}/${SERVICO}/aws4_request`;

  const query = new Map<string, string>([
    ['X-Amz-Algorithm', ALGORITMO],
    ['X-Amz-Credential', `${config.r2AccessKey}/${escopo}`],
    ['X-Amz-Date', dataHora],
    ['X-Amz-Expires', String(Math.min(Math.max(1, Math.floor(ttl)), TTL_MAXIMO))],
    ['X-Amz-SignedHeaders', 'host'],
  ]);
  /*
   * Sem isto o R2 devolve o mp4 sem Content-Disposition e o Safari do iPhone
   * só toca o vídeo — o "Baixar" vira "Assistir" (22/09, atleta Gustavo).
   * O parâmetro entra na assinatura, então não dá para acrescentar depois.
   */
  if (baixarComo) {
    const nome = baixarComo.normalize('NFD').replace(/[^\w.\- ]+/g, '').replace(/\s+/g, ' ').trim() || 'replay';
    query.set('response-content-disposition', `attachment; filename="${nome}.mp4"`);
  }

  const queryCanonica = [...query.entries()]
    .map(([k, v]) => [encodar(k), encodar(v)] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  const requisicaoCanonica = [
    metodo,
    caminho,
    queryCanonica,
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const paraAssinar = [ALGORITMO, dataHora, escopo, sha256(requisicaoCanonica)].join('\n');

  const chaveData = hmac(`AWS4${config.r2SecretKey}`, data);
  const chaveRegiao = hmac(chaveData, REGIAO);
  const chaveServico = hmac(chaveRegiao, SERVICO);
  const chaveAssinatura = hmac(chaveServico, 'aws4_request');
  const assinatura = createHmac('sha256', chaveAssinatura).update(paraAssinar, 'utf8').digest('hex');

  return `${endpoint.origin}${caminho}?${queryCanonica}&X-Amz-Signature=${assinatura}`;
}
