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
