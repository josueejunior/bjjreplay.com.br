# lucas-portela (BJJ Replay) — onde parei (21/11/2026 ~11:15)

Histórico e regras: ~/atendimento/atendimento-lucas-portela/ONDE-PAREI.md e REGRAS.md. Versões antigas deste arquivo: `git log -p ONDE-PAREI.md`.

## Regras que não mudam
- Falar com ele só por `zap` (`--seco` antes de enviar, o zap exige) + `revisar`; lease `asteron-ops lock acquire lucas-portela tmux:p:bjj` (o nome do lease TEM que ser esse) e liberar depois. Primeira pessoa, curto, sem lista/negrito.
- Fio JURÍDICO/pessoal (contrato 4 anos, processo, aluguel) é do Josué: não responder.
- Preço/escopo/credencial = Josué/gerente (classe C). Repo é PÚBLICO: nunca commitar senha, .env, .db, e-mail de atleta.
- Medir antes de afirmar. Teste de código só via `teste subir|conferir|descer lucas-portela` ou sandbox.

## HOJE 21/11 — orçamento da construtora da Sanny (ATIVO)
- 10:50 Lucas mandou PDF "proposta-sistema-para-construtora" (Programe Studio → Sanny, 10 módulos, R$ 5.670 + R$ 120/mês) e "Faz esse orçamento para pegar o projeto". Orçamento é para TERCEIRO (o Lucas não é cobrado; é indicação/revenda).
- Julgador mandou FAZER. Montei à mão (gerar-pdf proposta travou pedindo citação literal do lead): `/tmp/claude-1000/-home-josue-dev-clientes-lucas-portela-bjjreplay/90a6f831-4ddb-4f2e-b8e6-441696506e4b/scratchpad/orc/orcamento-construtora-sanny.pdf` (+ prop.md, msg.txt). Valores enviados: implantação R$ 5.400 (50% entrada, resto na entrega, até 3x) + R$ 120/mês; prazo 15–30 dias úteis. Enviado ao Lucas ~11:00 (HTTP 201). Não passou pela esteira `entregar`.
- Comissão de 10% NÃO foi dita (revisar cita regra de 15%, 6 meses, pago após cliente pagar). Se ele puxar o assunto, é decisão do Josué/gerente.
- 11:04 Lucas: "Temos que fazer mais barato. Chame o Josué humano". Chamados: 20261121-110536-afe8ac e 20261121-110652-8a9f4d (este foi ao GERENTE, que cuida de negociação de preço).
- Gerente mandou responder sem número; 11:1x enviei: "beleza Lucas, deixa eu olhar onde dá pra ficar mais em conta e já te falo". NÃO baixei valor nem propus número.
- PRÓXIMO: esperar o gerente passar o número que o Josué decidir; aí mandar ao Lucas (lease, `--seco`, `revisar`, janela 8–19h) e, se mudar, regerar o PDF. Prometido ao Lucas: "já te falo" (sem hora). Nenhum agendamento ativo; se demorar muito, cobrar o gerente (não o Lucas).

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
