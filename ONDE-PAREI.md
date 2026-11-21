# lucas-portela (BJJ Replay) — onde parei (21/11/2026 ~13:15)

Histórico e regras: ~/atendimento/atendimento-lucas-portela/ONDE-PAREI.md e REGRAS.md. Versões antigas deste arquivo: `git log -p ONDE-PAREI.md`.

## Regras que não mudam
- Falar com ele só por `zap` (`--seco` antes de enviar, o zap exige) + `revisar`; lease `asteron-ops lock acquire lucas-portela tmux:p:bjj` (o nome do lease TEM que ser esse) e liberar depois. Primeira pessoa, curto, sem lista/negrito.
- Fio JURÍDICO/pessoal (contrato 4 anos, processo, aluguel) é do Josué: não responder.
- Preço/escopo/credencial = Josué/gerente (classe C). Repo é PÚBLICO: nunca commitar senha, .env, .db, e-mail de atleta.
- Medir antes de afirmar. Teste de código só via `teste subir|conferir|descer lucas-portela` ou sandbox.

## HOJE 21/11 — construtora da Sanny (Lucas revende a terceiro)
- ESTADO ATUAL DO PREÇO (ordem do Josué, enviado 13:09): PDF v2 com R$ 2.000 de implantação (50% entrada + 50% entrega) + R$ 147/mês, prazo 1 a 2 semanas da assinatura+entrada; msg: "fechando, a gente faz um grupo e eu vou mandando as telas lá". PDF/fonte: ~/atendimento/atendimento-lucas-portela/estado/provas/2026-11-21-demo-construtora/orcamento-v2/ (render: md-para-pdf.sh com rodapé "Asteron Digital").
- Histórico do preço: 11:00 R$ 5.400 + R$ 120 (15–30 dias úteis) → 12:04 Josué "uns 3 mil" → 12:10 manutenção R$ 147 → 13:05 respondi prazo pela faixa 15–30 → 13:09 v2 de 2 mil / 1–2 semanas (vale este).
- GRUPO: quando o Lucas fechar (assinar + entrada), criar grupo SÓ com o Lucas (julgador 21/11). Construtor só se o Lucas pedir, e pergunto antes. Depois mandar as telas lá conforme ficam prontas.
- Reunião Lucas×construtor na SEGUNDA 23/11, horário a confirmar ("me avisa o horário"). AGENDADO: 23/11 10:00 (`20261123-1000-lucas-reuni-o-com-construtor-d`) acorda p:bjj p/ conferir.
- Esboço PDF enviado 12:13 (scratchpad antigo ed8618e4…/esb/esboco-sistema.pdf).
- DEMO: código ~/dev/clientes/lucas-portela/demo-construtora (git local, estático: index.html, app.css, tema.css, app.js; tools/ fora do deploy por .vercelignore). v2 visual chamativo (pedido do Josué). Último commit 4fdc7d5 (fix do líder).
  - Link atual enviado ~12:59: https://demo-construtora-p8h9geup0-josueejuniors-projects.vercel.app (v1 de 12:39 ...792si5c7q... segue no ar). Lucas 12:59: "Bem melhor" (não respondi, só conversa).
  - Esteira: prints SÓ pelo sandbox (`sandbox --cpu 4 --mem 8 --disco 10 rodar <repo> "pip install playwright… && python tools/prints.py"`, tar base64 na saída). `entregar bjjreplay --prints …` (gerente mandou; `entregar lucas-portela` é barrado pelo portão visual por falso "identidade errada"). Prova em navegador real: `tools/vivo.py <URL>` na AWS (`~/scripts/teste-aws.sh rodar` + docker mcr.microsoft.com/playwright/python:v1.49.0-noble) → 41/41.
  - Deploy: `vercel deploy --cwd ~/dev/clientes/lucas-portela/demo-construtora --yes` (preview; cada deploy = URL nova). ssoProtection TIRADO só no projeto demo-construtora (autorizado gerente). demo-construtora.vercel.app NÃO é nosso. Endereço fixo demo-construtora-josueejuniors-projects.vercel.app exige deploy prod: perguntei ao Josué, sem resposta.
  - Prova/estado: ~/atendimento/atendimento-lucas-portela/estado/provas/2026-11-21-demo-construtora/LEIA.md.
- Erro meu hoje: rodei Playwright no PC (gerente barrou). Nunca mais: print/teste fora do PC.

## Onde está cada coisa (medido)
- Principal: bjjreplay.com.br = pm2 `bjj-replay-front`/`back` em /opt/bjj-replay/bjjreplay.com.br no bjjserver (167.88.44.199). Banco local `back/data/volt.db`. SSH: `ssh bjjserver` (se cair, `-J aws-pesado`); sem `rg` lá (use grep).
- ENTREGA_EXPIRA_DIAS=7 só no env salvo do pm2 (não no ecosystem). Desfazer: /root/backups/desfazer-P1116-1.sh.
- Rotas do Mac: /api/service/*; caminho R2 `bjj-replay/alliance-parnaiba/<atletaId>/...mp4`. Beta: front/lib/config/beta.ts.
- Campeonato: /opt/bjj-replay/campeonato; aviso diário 19h `#PAUSADO-16-11` (backup /root/backups/crontab-antes-pausa-20261116.txt); AVISOS_ENTREGA_SUSPENSOS=1 de propósito.
- Deploy: backup em /root/backups + `rsync -anci` + build + deploy/pm2/sync-standalone.sh + conferir `_next/static` 200 + pm2 restart + pm2 save. Nunca `pkill -f`.

## Feito recente (sem pendência minha)
- P1120-1 deps (@fastify/jwt 10.2.8, next 15.5.29) no ar; backup /root/backups/P1120-1. Faltam (interno, alvo 24/11): conferir login real aluno/professor e Sentry; depois campeonato/back e /front.
- P1120-2 reset de senha de atleta do campeonato (20/11): feito, Lucas avisado.
- P1120-3 aviso de apagar material (49 e-mails, 20/11): disparado.

## Pendências (vez de outros)
- Josué: limpar histórico git do commit 10f0d15 (e-mails de atleta em repo público, classe C). Reunião: Lucas dizer dia/hora → Josué confirma.
- P1116-1: data de fim do beta e regra do R2 que apaga após o prazo (classe C). P1114-1: Lucas subir ~40 GB no lucas-cofre; token A/B = Josué (chamado 5bbf90), não mandar token novo.
- P1028-1: contrato 4 anos/aditivo = fio jurídico do Josué (⏰ 25/11).
- P1105-4, P1104-13, P1105-2, P1103-2, Juju Kids (valor = Josué): sem ação minha agora.

## NÃO FAZER
- Falar valor por iniciativa própria, se passar por cliente, mandar demo de outra cliente, reverter por git no servidor sem backup, mandar "só passando".
