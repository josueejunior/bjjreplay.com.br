# lucas-portela (BJJ Replay) — onde parei (condensado em 12/11/2026 ~16:10)

Histórico completo e regras: ~/atendimento/atendimento-lucas-portela/ONDE-PAREI.md e REGRAS.md. Histórico antigo deste arquivo está no git (`git log -p ONDE-PAREI.md`).

## Regras que não mudam
- Falar com ele só por `zap` (`--seco` antes), lease `asteron-ops lock acquire lucas-portela tmux:p:bjj` (nome exato). Primeira pessoa, curto, sem lista/negrito.
- Lucas NÃO é cobrado (troca de serviço): nunca falar valor; se ele puxar dinheiro, avisar o Josué. Preço/escopo/credencial = Josué (classe C).
- Fio JURÍDICO/pessoal (processo, aluguel, remédio, voz/áudio de outra pessoa) é do Josué: não responder, não abrir pedido.
- Medir antes de afirmar; verificar o efeito. Teste de código só via `teste subir|conferir|descer lucas-portela` (AWS) ou sandbox; nunca no PC/notebook.

## Último atendimento (12/11)
- Lucas 15:44 "Como está os cadastros?" (SLA 18 min). Medi no volt.db do bjjserver (só leitura): 28 contas, 25 novas desde 07/11 (10/11: 20, 11/11: 3, 12/11: 1; resto = admin/demo/seed).
- Respondi pelo zap (HTTP 201, lease tmux:p:bjj): 25 desde o dia 7, 20 no dia 10, 3 ontem, 1 hoje. Sem promessa nova. Commit/push feito.

## Prometido com hora
- Nada. Nenhum agendamento ativo. Prazo final antigo dos pedidos (07/11 12:00) já passou.
- Promessa sem hora de 10/11 ("acompanhar acessos e cadastros") ficou atendida com a planilha do Josué (10/11) e o número de hoje. Acessos seguem SEM número (sem analytics; access.log do nginx é único para todos os vhosts).

## Onde está cada coisa (medido)
- Site principal: bjjreplay.com.br = pm2 `bjj-replay-front`/`bjj-replay-back` em /opt/bjj-replay/bjjreplay.com.br no bjjserver (167.88.44.199). Banco LOCAL volt.db (USE_SUPABASE=false desde 06/11; Supabase sxxzk… sumiu). Contas antigas do Supabase não existem no local.
- Rotas do Mac no principal: /api/service/ping|atletas|atletas/:id/foto|upload-url|entregas|chamados (token de serviço; sem /vetores; chamados sem dados de quem abriu). Contrato final (Josué 10/11): sem `metadados`, `tatame` string, `inicio_luta_s`/`fim_luta_s`/`duracaoS` inteiros, campo desconhecido ignorado, `entregar:true` só no PATCH.
- Beta no ar: home com selo (flag NEXT_PUBLIC_BETA_GRATUITO no front/.env.production.local do servidor), Relatar problema, Ajude (3 dias), "Minha luta não foi encontrada" (7 dias), aviso câmera preta, player com janela da luta. Flags em front/lib/config/beta.ts.
- Sentry no ar (back v10.78 fixada de propósito; v11 coleta PII). Rebuild do front exige exportar NEXT_PUBLIC_SENTRY_DSN antes do build; SENTRY_DSN/R2_* só no ambiente salvo do pm2.
- Deploy: backup em /root/backups + `rsync -anci` + build + deploy/pm2/sync-standalone.sh + conferir `_next/static` 200 + pm2 restart + pm2 save. Nunca `pkill -f`. ecosystem.config.cjs agora com USE_SUPABASE='false'.
- SSH: `ssh bjjserver` direto funciona hoje; se cair, `ssh -J aws-pesado bjjserver` ou `-J root@72.62.8.242`.
- Cartão do contador (P1103-2): ~/dev/clientes/lucas-portela/bjjreplay-anim/cartao.py (prévia enviada 06/11, sem ok do Lucas).

## Pendências (todas aguardando outro; nada com a nossa vez)
- P1105-4: Lucas testar `/api/service/chamados` no Mac (`[]` 200 = certo → fechar pedido e perguntar próximo passo do agente).
- P1104-13: Lucas apontar o Mac para https://bjjreplay.com.br; teste R2 com .mp4 real em produção.
- P1105-2: termos/LGPD com aceite no cadastro, quando ele mandar o texto.
- P1103-2 (cartão), P1104-2 / P1105-1 (proposta/painel Juju Kids sem valor; escopo/preço = Josué), P1104-5/-6/-7: vez do Lucas ou do gerente/SDR.
- P1028-1 e preços: Josué. Horário de servidor com o Lucas: Josué marca.
- Infra do Josué (classe C): aster-linha3 parou de receber em 07/11; mensagens dele voltaram a chegar em 10–12/11 (conferir se estável; reconectar instância só com o Josué).
- Menores: mensagem de recadastro dos alunos (contas do Supabase perdidas; Lucas não foi avisado; revisar pediu ajuste); logo 4K cancelada ("não precisa").

## NÃO FAZER
- Trocar/disfarçar voz, se passar por cliente (Dona Tereza, Bruno Perini): recusado; avisar p:gerente se cobrar.
- Mandar vídeo demo de outra cliente (Giovanna). Falar valor. Reverter por git no servidor sem backup.
- Repo é PÚBLICO no GitHub: nunca commitar seed com senha, .env, .db, DSN.

## Próximo passo
- Ao chegar demanda: ler ~/contexto-clientes/lucas-portela/<dia>.md antes de qualquer envio. Sem nada novo, não mandar "só passando".

- 12/11 19:38 Lucas "O mac ja puxou esses cadastros?": NÃO. Log nginx do bjjserver: Mac (python-httpx, 170.80.82.69) só chama campeonato (08:45 e 17:30); no principal só o curl de teste dele em 10/11 21:58. Respondido 22:4x; aguarda ele apontar o Mac p/ bjjreplay.com.br (P1104-13) e avisar; conferir no log. Principal: 26 atletas, 22 com foto.

## 16/11 — P1116-1 entregas do Mac (prompt do dev do Lucas)
- Mac JÁ manda para o principal (16/11 16:00: entregas 1 e 2, chave antiga `academia/lutas/...-v1-lite.mp4`).
- No ar (back, commit bae84e0, backup /root/backups/*-20261116-2031*): upload-url com {atletaId, luta, gravadoEm} → {url, objectKey, versao}, caminho `bjj-replay/alliance-parnaiba/<atletaId>/<data>_<hora>_<luta>_v<versao>.mp4`; entregas devolve versao+objectKey; coluna `versao`.
- Front (tela "vídeo expirado") commitado e NÃO publicado: só com ENTREGA_EXPIRA_DIAS>0, quando o Lucas decidir os 4 dias. Regra de apagar no R2 não criada (classe C, espera decisão).
- Gerente 16/11: aprovado 40 GB no R2 para a pasta do Lucas (chamado 64f3ad) — P1114-1; token/chave segue só com ordem do Josué.
- 16/11 18:0x prazo LIGADO em produção: ENTREGA_EXPIRA_DIAS=4 só no env salvo do pm2 (não está no ecosystem.config.cjs; restart por ecosystem perde, como já perde R2/Sentry). Front com "Vídeo expirado" publicado (commit aa194fb, esteira APROVADO). Desfazer: `/root/backups/desfazer-P1116-1.sh` (só prazo) ou `--front` (backup em /root/backups/P1116-1-20261116-2059). Lucas 17:44: 4 dias "somente para fase beta" → desligar no fim do beta (data: Josué pergunta). Item 3 (regra R2 que apaga) = Josué.

## Cochilo 16/11 ~18:15 — estado
- Último envio: 18:03 ao Lucas ("liguei os 4 dias so pra fase beta… arquivo nao e apagado do r2 ainda"). Nada dele depois.
- Conversa das 18h é do Josué (gerente 17:5x): não escrever ao Lucas sobre ela; se ele mandar algo sobre isso, só avisar o gerente.
- Pendente (P1116-1, vez de outros): Josué pergunta ao Lucas a data de fim do beta → então `ENTREGA_EXPIRA_DIAS=0` (ou `/root/backups/desfazer-P1116-1.sh`). Item 3 (regra R2 que apaga) = Josué, classe C.
- P1114-1: gerente aprovou 40 GB no R2 para a pasta do Lucas (chamado 64f3ad); token/chave só com ordem do Josué.
- Prometido com hora: nada. O lembrete agendado das 17:45 (conversa 18h) já passou.
- Próximo passo: quando o Mac usar o caminho novo (upload-url com atletaId+luta), conferir no volt.db `versao` e `object_key` em bjj-replay/alliance-parnaiba/…; esperar o Lucas rodar os 6 testes dele.

## 16/11 18:3x — PATCH /api/service/entregas/:id no ar (P1116-1)
- Lucas 18:20: upload-url e entregas OK (ids 1 e 2 sem duplicar); faltava o PATCH `{"entregar": true}` (dava 404). Criado (commit na main) e publicado só no back; backup `/root/backups/back-antes-patch-20261116.tgz`; env do pm2 (ENTREGA_EXPIRA_DIAS=4, R2) conferido depois do restart.
- Comportamento: 200 `{id, entregue:true, versao, objectKey}`; repetir ok; 404 id inexistente; 401 sem token; aceita janela inicio/fim (400 se inválida). A entrega já nasce ENTREGUE no POST, então o PATCH só confirma (dito ao Lucas, 2 msgs).
- Teste: fumaça local passou, mas não bateu o PATCH em produção com token real (só 401 sem token). Esperar o Mac chamar e conferir no log.

## Cochilo 16/11 ~18:55 — estado
- 18:31 Lucas: pausar e-mails e disparar amanhã de manhã com as entregas de hoje. FEITO: cron das 19h do campeonato (bjjserver) comentado como `#PAUSADO-16-11`; backup `/root/backups/crontab-antes-pausa-20261116.txt`. Para despausar: tirar o `#PAUSADO-16-11 ` da linha. Disparo manual: `disparar-avisos-entrega.mjs` (ensaio sem `--valendo`, depois com).
- Perguntei a hora do disparo (18:3x); Lucas NÃO respondeu a hora. Ele só disse "te aviso se todas de hoje derem certo" (18:34): sem resposta devida.
- 18:41 enviei o desenho de inferência + suporte (3 msgs, revisar APROVADO, a pedido do gerente via julgador; sem PDF). Tempo/custo por vídeo NÃO medidos (dito ao Lucas); melhorias propostas: tempo do Mac na entrega, aviso agrupado por manhã, painel "luta não encontrada" com motivo.
- Prometido com hora: nada agendado. Atenção: o disparo de amanhã de manhã depende da hora do Lucas.
- Próximo passo: quando o Lucas responder a hora (ou amanhã cedo), rodar o ensaio do script, conferir as lutas de hoje, só então `--valendo`, com lease; depois reativar o cron se ele quiser voltar ao lote das 19h. Conferir no log se o Mac chamou o PATCH de entregas (ainda não visto em produção com token real).
