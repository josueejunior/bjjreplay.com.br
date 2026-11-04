# Beta — contrato proposto para a entrega com janela da luta

Proposta de 04/11/2026 (bloco E do beta, `BRIEFING_FRONT_BETA.md`, seção "Vídeo da luta: 1 minuto antes e depois").
Nomes e campos são proposta: o Mac e o Lucas podem ajustar antes de implementar.

## Por quê

O vídeo entregue passa a ter 1 min antes e 1 min depois da luta detectada. O player precisa abrir já no início da
luta e marcar na barra de tempo onde ela começa e termina. Quem sabe esses instantes é o Mac, que manda o
deslocamento em segundos junto com a entrega.

## Campos novos

| Campo | Tipo | Regra |
| --- | --- | --- |
| `inicio_luta_s` | inteiro | `>= 0`, segundos desde o começo do arquivo |
| `fim_luta_s` | inteiro | `>= 0` e **maior** que `inicio_luta_s` |

- Os dois vão juntos ou nenhum. Se faltar um, ou se `fim_luta_s <= inicio_luta_s`, o campo é descartado e o
  player se comporta como antes (abre do começo, sem faixa). Na **gravação**, o servidor devolve `400`
  ("inicio_luta_s e fim_luta_s devem ser inteiros >= 0, com fim maior que o início") em vez de descartar em silêncio.
- Na **leitura** (biblioteca do aluno) os campos aparecem na luta só quando a janela é válida.
- `borda_origem` (`video` | `bipe`) **não entra agora**: o briefing diz que é só informação do Mac e não aparece na tela.

## Onde entra

### Rota do Mac (hoje no app campeonato)

`POST /api/service/entregas` (token `X-Service-Token`, já existente em `campeonato/back/src/routes/service.routes.ts`)
ganha os dois campos opcionais:

```json
{
  "atletaId": "8b95936b-5557-49b6-add6-5e8283287a11",
  "titulo": "Treino aberto — Aliança Parnaíba",
  "luta": "L07",
  "tatame": "Tatame 1",
  "adversario": "Rafael Menezes",
  "objectKey": "entregas/2026-11-03/L07-diego.mp4",
  "tamanhoBytes": 48213377,
  "duracaoS": 180,
  "inicio_luta_s": 60,
  "fim_luta_s": 120
}
```

A idempotência continua a mesma (`atletaId` + `luta` + `objectKey`): repetir a chamada devolve a entrega
existente. Se a repetição trouxer uma janela diferente, a proposta é **atualizar a janela** da entrega existente
(o Mac pode refinar a borda depois, por exemplo com o bipe do cronômetro) e responder `200` com `jaExistia: true`.

### Site principal (este repositório)

Já implementado (sem deploy):

- Tabela `biblioteca_lutas` ganhou as colunas `inicio_luta_s` e `fim_luta_s` (migração `ensureColumn`, dados antigos intactos).
- `GET /api/biblioteca/:alunoId` devolve os dois campos em cada luta quando a janela é válida:

```json
{ "id_luta": 9001, "status": "ENTREGUE", "url_horizontal": "https://.../a.mp4", "inicio_luta_s": 60, "fim_luta_s": 120 }
```

- Validação única em `back/src/lib/janela-luta.ts` (`janelaValida` para leitura, `exigirJanela` para gravação).

## Pendente de decisão (não bloqueia o front)

1. **Onde a entrega do Mac cai:** hoje `/api/service/entregas` vive no app campeonato e escreve em `assets`; a biblioteca do
   site principal lê `biblioteca_lutas` (ou Supabase). Falta decidir qual back recebe a entrega do beta — este documento vale para os dois.
2. **Supabase:** se o site real lê da base Supabase, as colunas precisam existir lá também (hoje o mapeador de sessões não as preenche).
3. **Reels vertical (9:16):** a janela vale só para o vídeo horizontal; o reels já é outro corte. Se o Lucas quiser janela também no reels, entra como `inicio_reels_s`/`fim_reels_s`.
