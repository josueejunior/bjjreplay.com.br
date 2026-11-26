# lucas-portela (BJJ Replay) — onde parei (26/11/2026 ~09:15, cochilo)

## ATUALIZAÇÃO 26/11 (vale sobre o resto abaixo)
- Combinado 25/11 JÁ registrado no P1125-2 (3 produtos máx.; Lucas vende/grava, Josué produz; VSL por produto; R$ 1000 tráfego; cidades vizinhas; reunião HOJE 10h). 2026-11-26.md existe: Lucas 08:58 mandou link do Vade Mecum Trabalhista p/ IA (R$ 67) "vamos criar um produto assim" + "só agentes ou só instruções.md?". JOSUÉ respondeu ele mesmo 08:59-09:00 pelo celular. Eu NÃO enviei nada hoje.
- Decisão do gerente (chamado 20261126-085922-0933be): produto em 2 degraus: base = acervo .md; acima = agente pronto que usa o acervo (mensal). Tema e preço fecham na reunião 10h, não por chat. Texto sugerido ao Lucas NÃO enviado (Josué conduz); só mandar se o Josué pedir (assumir, lease tmux:p:bjj, --seco, revisar).
- RESUMO.md do atendimento atualizado (item 0, 26/11). Os 3 vencidos (25/11 10:00): P1028-1 contrato/aditivo, P1114-1 chave R2, P1116-1 ok classe C do item 3: vez do JOSUÉ nos três (registrado nas notas).
- Prometido com hora: lembrete interno 09:30 de hoje (job `20261126-0930-lembrete-interno-reuni-o-com-l`, chamar-josue); toque leve sex 27/11 09:00 (job 20261127-0900-...) segue de pé.
- PRÓXIMO PASSO: nada a enviar ao Lucas. Depois da reunião das 10h, ler 2026-11-26.md, registrar o que fechou (tema, formato, cidades, preço) no P1125-2 e mover P1125-1 (demo sex 27/11 13h). Cidades do Lucas ainda não chegaram. Pendente do Josué: textos das VSL e material.

---- (abaixo: estado de 25/11 ~20h) ----


## ESTADO AGORA
- **Josué assumiu a conversa ao vivo pelo celular desde 19:53** (`asteron assumiu lucas-portela` = até 22:57). A sessão NÃO envia nada ao Lucas; só registra o combinado. Gerente 19:5x: "PARE".
- Combinado até 19:54 (Josué×Lucas): vender site + agentes de IA; sistemas prontos adaptados por nicho; esteira de produtos; Lucas quer R$ 1000 de tráfego e perguntou das VSL. Pedido P1125-2 "fazendo".
- Enviei hoje pelo zap (todos com revisar APROVADO): 15:43 "fechado, sexta então…"; 19:37 "vou conferir se consigo fazer a demo sexta às 13h…"; 19:46 pergunta o que quer vender e onde; 19:51 2 caminhos (atendente IA WhatsApp R$ 600–1.000 + R$ 297–397/mês; site institucional R$ 900–1.500 à vista, 5–7 dias úteis) como preço de venda ao cliente final, fechando com "triagem ou site publicado?". Texto do Josué original foi reprovado por conteúdo (PACOTES §1/§4, FATOS).
- Lucas 19:35: demo da construtora ficou para SEXTA 27/11 13h; pediu reunião antes. Lucas diz que faz a demo sozinho se o Josué não puder.

- 20:3x gerente: Josué decide produtos/vídeos/negócio ao vivo; eu não espero nada hoje. Amanhã 08:30 (job `20261126-0830-p-bjj-ler-combinado-josue-x-lu`) leio o combinado e registro no P1125-2.
- Material interno pronto (não enviado): ~/atendimento/atendimento-lucas-portela/material/2026-11-26-esteira-3-produtos-RASCUNHO.md. Lucas 20:24 pediu reunião amanhã antes do disparo e disse que "importante é VSL".
- Alerta de SLA "Organizando o horário" (14:11) já respondido 15:43; gerente avisado às 20h; não reavisar.
  Causa (medida 21h): a msg 14:11 veio com @lid SEM remoteJidAlt e o vigia-esperando a separa do telefone. Paliativo: `asteron assumir 202366041215040` até 22:56. Correção proposta NÃO aplicada (Guarda 19aeb4 barrou o teste; `pedir-liberacao` não existe no PATH): ~/atendimento/nucleo/vigia-esperando.sh.proposta-lid-20261125; decisão com o gerente. Depois de 22:56 o alerta pode voltar até 26/11 14:11.
- Lucas 20:43 propôs a reunião de amanhã às 10h ("Ok, pode ser as 10?"); Josué conduz.

- PRÓXIMO PASSO (cochilo 25/11 ~21h): nada a enviar hoje. 26/11 08:30 o job acorda p:bjj: ler o combinado (reunião 10h? produtos/VSL/cidades) e registrar no P1125-2; se o gerente decidiu sobre a correção do vigia (@lid), seguir a decisão (backup do original: vigia-esperando.sh.bak-20261125-lid).

## Pendências
- Josué: confirmar se consegue sexta 27/11 13h (chamado 20261125-194059-227c0b; gerente respondeu ao 194844-b81d16: "continue como Josué"). Não prometer presença nem comissão; se perguntar: "amanhã a gente alinha a sexta".
- P1125-1 (horário da demo/reunião prévia, "aguardando", prazo sex 09:00). P1125-2 (produtos/tráfego, "fazendo").
- Prometido com hora: toque leve sexta 27/11 09:00, job `20261127-0900-toque-leve-lucas-hor-rio-da-de` (acorda p:bjj; só manda 1 linha se o horário ainda não veio; lease+--seco+revisar). Se o Josué ainda conduzir, só olhar o contexto.
- Vigia de SLA cobra a mensagem das 14:11 mesmo respondida (15:43): conferir o contexto e NÃO duplicar; baixa é do gerente.
- Preço/comissão/valor ao Lucas: só o que o Josué/gerente mandar; Lucas NÃO é cobrado pelos serviços dev↔jurídico (não falar valor do BJJ).

## Lições de hoje (erros meus)
- Lease: pegar SEMPRE como `tmux:p:bjj` (com `atendimento:lucas-portela` o zap barra). `zap` exige `--seco` do mesmo texto antes; timeout de 30 s: conferir `zap log` antes de reenviar.
- Agendar com destino `p:bjj` (não `bjj`). `revisar --cliente lucas-portela < arq`; lê a 1ª linha, sem APROVADO não envia. Não existe `conferir-entrega` aqui: conferir por HTTP 201 + `zap log`.
- Daily escrito em ~/atendimento/daily/2026-11-25/p_bjj.md.

## Regras que não mudam
- Falar com ele só por `zap` (`--seco` antes de enviar, o zap exige) + `revisar`; lease `asteron-ops lock acquire lucas-portela tmux:p:bjj` (o nome do lease TEM que ser esse) e liberar depois. Primeira pessoa, curto, sem lista/negrito.
- Fio JURÍDICO/pessoal (contrato 4 anos, processo, aluguel) é do Josué: não responder.
- Preço/escopo/credencial = Josué/gerente (classe C). Repo é PÚBLICO: nunca commitar senha, .env, .db, e-mail de atleta.
- Medir antes de afirmar. Teste de código só via `teste subir|conferir|descer lucas-portela` ou sandbox.

## Onde está cada coisa (medido)
- Principal: bjjreplay.com.br = pm2 `bjj-replay-front`/`back` em /opt/bjj-replay/bjjreplay.com.br no bjjserver (167.88.44.199). Banco local `back/data/volt.db`. SSH: `ssh bjjserver` (se cair, `-J aws-pesado`); sem `rg` lá (use grep).
- ENTREGA_EXPIRA_DIAS=7 só no env salvo do pm2 (não no ecosystem). Desfazer: /root/backups/desfazer-P1116-1.sh.
- Rotas do Mac: /api/service/*; caminho R2 `bjj-replay/alliance-parnaiba/<atletaId>/...mp4`. Beta: front/lib/config/beta.ts.
- Campeonato: /opt/bjj-replay/campeonato; aviso diário 19h `#PAUSADO-16-11` (backup /root/backups/crontab-antes-pausa-20261116.txt); AVISOS_ENTREGA_SUSPENSOS=1 de propósito.
- Deploy: backup em /root/backups + `rsync -anci` + build + deploy/pm2/sync-standalone.sh + conferir `_next/static` 200 + pm2 restart + pm2 save. Nunca `pkill -f`.

## NÃO FAZER
- Falar valor por iniciativa própria, se passar por cliente, mandar demo de outra cliente, reverter por git no servidor sem backup, mandar "só passando".

## Histórico curto (21–25/11)
- 21/11: construtora da Sanny (Lucas revende): PDF v2 R$ 2.000 + R$ 147/mês, demo em ~/dev/clientes/lucas-portela/demo-construtora (vercel preview, só pelo sandbox/teste fora do PC). Estado: ~/atendimento/atendimento-lucas-portela/estado/provas/. Grupo só com o Lucas quando fechar.
- Pendências de outros: Josué limpar histórico git do commit 10f0d15 (classe C); P1116-1 fim do beta/R2 apaga (classe C); P1114-1 token R2 (Josué); P1028-1 contrato 4 anos = fio jurídico do Josué.
- Histórico completo: `git log -p ONDE-PAREI.md` e ~/atendimento/atendimento-lucas-portela/ONDE-PAREI.md.
