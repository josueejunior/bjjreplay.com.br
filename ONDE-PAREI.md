# lucas-portela (BJJ Replay) — onde parei (condensado em 19/11/2026 ~10:30)

Histórico completo e regras: ~/atendimento/atendimento-lucas-portela/ONDE-PAREI.md e REGRAS.md. Versões anteriores deste arquivo no git (`git log -p ONDE-PAREI.md`).

## Regras que não mudam
- Falar com ele só por `zap` (`--seco` + `revisar` antes), lease `asteron-ops lock acquire lucas-portela tmux:p:bjj`. Primeira pessoa, curto, sem lista/negrito.
- Lucas NÃO é cobrado (troca de serviço): nunca falar valor. Preço/escopo/credencial = Josué (classe C).
- Fio JURÍDICO/pessoal (contrato 4 anos, processo, aluguel) é do Josué: não responder, não abrir pedido.
- Medir antes de afirmar. Teste de código só via `teste subir|conferir|descer lucas-portela` ou sandbox; nunca no PC.
- `revisar` lê FATOS/ONDE-PAREI e pode estar atrasado: mande "CONTEXTO VERIFICADO (medido …)" junto quando o fato é de hoje.

## Hoje 19/11 (Lucas 09:03: reunião + 7 dias + e-mails)
- FEITO 09:05: ENTREGA_EXPIRA_DIAS=7 no env salvo do pm2 (bjj-replay-back, `--update-env` + `pm2 save`; conferido 7). NÃO está no ecosystem.config.cjs (restart por ecosystem perde, como R2/Sentry). Desfazer: `/root/backups/desfazer-P1116-1.sh` (zera) ou reiniciar com outro valor.
- FEITO 09:3x: e-mail "tem luta nova sua no portal" aos 4 atletas com luta ENTREGUE em 16–19/11 (lista: query no volt.db, ver script). Canal = SMTP contato@bjjreplay.com.br do campeonato (decisão do julgador; atletas não têm telefone). 4 ACEITOS no SMTP (entrega na caixa não conferida). Script pontual `/root/backups/aviso-portal.mjs aviso.txt` (ensaio sem `--valendo`); log em /var/log/campeonato-avisos-entrega.log.
- Zap ao Lucas: 09:20 (3 msgs: 7 dias no ar; e-mails "te falo hoje"; "que dia e horário fica bom pra reunião?") e 09:53 ("disparei os e-mails pros 4 atletas"). Retorno agendado das 16h CANCELADO (cumprido).
- Lucas não respondeu desde então. Vez DELE: dia/hora da reunião. Quem confirma agenda = Josué.
- Vigia de contexto alertou 56 e 77 min "sem resposta": falso positivo (o modelo vê reunião sem data). Lição registrada; não mandar msg por isso. Josué pode calar com `asteron assumir lucas-portela`.
- O portal principal NÃO tem aviso automático de luta nova. Se o Lucas quiser diário, é pedido novo (mailer no back do principal).

## Prometido com hora
- Nada. Nenhum agendamento ativo.

## Onde está cada coisa (medido)
- Principal: bjjreplay.com.br = pm2 `bjj-replay-front`/`bjj-replay-back` em /opt/bjj-replay/bjjreplay.com.br no bjjserver (167.88.44.199). Banco LOCAL `back/data/volt.db` (USE_SUPABASE=false). Lutas do Mac em `biblioteca_lutas` (ids 1–6 até hoje); users sem telefone.
- Rotas do Mac: /api/service/ping|atletas|atletas/:id/foto|upload-url|entregas (POST nasce ENTREGUE; PATCH `{entregar:true}` idempotente)|chamados. Caminho R2 `bjj-replay/alliance-parnaiba/<atletaId>/<data>_<hora>_<luta>_v<versao>.mp4`.
- Beta: flags em front/lib/config/beta.ts; tela "Vídeo expirado" publicada (aa194fb). Sentry no ar (back v10.78 fixada; rebuild do front exige NEXT_PUBLIC_SENTRY_DSN).
- Campeonato: /opt/bjj-replay/campeonato; aviso diário 19h por cron do root está `#PAUSADO-16-11` (backup /root/backups/crontab-antes-pausa-20261116.txt). Despausar = tirar o prefixo, só se o Lucas pedir. AVISOS_ENTREGA_SUSPENSOS=1 fica ligado de propósito.
- Deploy: backup em /root/backups + `rsync -anci` + build + deploy/pm2/sync-standalone.sh + conferir `_next/static` 200 + pm2 restart + pm2 save. Nunca `pkill -f`.
- SSH: `ssh bjjserver` (se cair, `-J aws-pesado`). No bjjserver não há `rg` (use grep).

## P1120-1 (vigia-deps 20/11, interno, FEITO bjjreplay)
- @fastify/jwt 10.2.8 (back) e next 15.5.29 (front) no ar desde 11:5x; audit sem crítica. Backup /root/backups/P1120-1 (package*.json + tgz de dist/.next). Reverter: restaurar e rebuild + sync-standalone + pm2 restart. Next 15 pede `outputFileTracingRoot` (commit no front). Conferido: JWT válido passa, adulterado 401, imagem otimizada 200.
- Próximo passo (meu, sem prazo prometido a cliente; alvo interno 24/11 17:00 da lista do vigia): conferir login real aluno/professor e Sentry; depois campeonato/back e /front (3 críticas cada, mesma lista). Fora deste pedido; fazer à parte.

## Pendências (vez de outros)
- AVISAR O JOSUÉ: o commit de 19/11 09:3x ("avisos de luta nova…") pôs 4 e-mails de atleta no ONDE-PAREI deste repo PÚBLICO (já tirado do arquivo, segue no histórico). Limpar histórico = decisão dele (classe C).
- Reunião: Lucas dizer dia/hora → Josué confirma.
- P1116-1: data de fim do beta (aí ENTREGA_EXPIRA_DIAS=0) e item 3 (regra no R2 que apaga após o prazo, classe C = Josué). Prazo agora 7 dias.
- P1114-1: pasta lucas-cofre no R2 (40 GB aprovado); Lucas subir e avisar; token A/B = Josué (chamado 5bbf90). Não mandar token novo.
- P1028-1: contrato 4 anos/aditivo = fio jurídico do Josué; sessão não manda nada.
- P1105-4 (testar /chamados no Mac), P1104-13 (Mac no principal: já manda), P1105-2 (termos/LGPD quando ele mandar texto), P1103-2 (cartão), Juju Kids (valor = Josué).
- Conferir no log se o Mac chama o PATCH de entregas com token real (ainda não visto).

## NÃO FAZER
- Trocar/disfarçar voz, se passar por cliente; mandar demo de outra cliente; falar valor; reverter por git no servidor sem backup.
- Repo é PÚBLICO: nunca commitar seed com senha, .env, .db, DSN, e-mails de atleta em massa.

## Estado no cochilo (19/11, sessão renovada)
- Retomei: nada pendente meu, nenhum agendamento ativo, nada enviado ao Lucas nesta sessão. Não conferi o enviadas.log (comando falhou; não há CLAUDE.md na pasta).
- Avisado ao Josué (na conversa): e-mails de atleta no histórico do commit 10f0d15 (repo público) e reunião aguardando dia/hora do Lucas.

## Próximo passo
- Chegando demanda: ler ~/contexto-clientes/lucas-portela/<dia>.md antes de qualquer envio. Sem nada novo, não mandar "só passando".

## P1120-2 (reset de senha, 20/11 ~09:28) FEITO
- Lucas pediu reset do atleta do campeonato (e-mail no PEDIDOS/log do servidor). Senha aleatória só por e-mail ao atleta; Lucas recebeu "mandei o acesso pro e-mail do atleta". Backup: /root/backups/campeonato-antes-reset-20261120.db. Campeonato não tem "esqueci a senha" nem troca obrigatória (se o Lucas quiser, é pedido novo).

## Estado no cochilo (20/11, ~11:10)
- Pendente meu: nada. P1120-2 (reset de senha do atleta do campeonato) feito e no-ar; Lucas avisado por zap. Não conferi se o e-mail chegou na caixa do atleta (SMTP só ACEITO).
- Prometido com hora: nada. Nenhum agendamento ativo.
- Próximo passo: sem demanda nova, não mandar nada. Se o Lucas ou o atleta reclamar de acesso, ler ~/contexto-clientes/lucas-portela/<dia>.md antes de responder; troca obrigatória/"esqueci a senha" no campeonato só se o Lucas pedir (pedido novo). Interno sem prazo a cliente: P1120-1 resto (login real aluno/professor, Sentry; campeonato/back e /front com 3 críticas cada, alvo 24/11 17:00).
- Lembrete ao Josué ainda aberto: e-mails de atleta no histórico do commit 10f0d15 (repo público); limpar = decisão dele.

## P1120-3 (20/11 ~12:20) aviso de apagar material do campeonato
- Lucas 12:09 pediu mensagem a todos os cadastros do campeonato (material será apagado, baixem logo) e quer APROVAR antes. Mandei o rascunho + perguntei a DATA do apagamento e se vai por e-mail (cadastros sem telefone). NADA disparado.
- Próximo: Lucas aprovar texto e dar a data → ensaio do envio (script /root/backups/aviso-portal.mjs como modelo, sem --valendo) → só então disparar e avisar. Apagar o material em si = classe C (Josué).
