# lucas-portela (BJJ Replay) — onde parei (27/11/2026 09:12)

> COCHILO 27/11 ~09:25. Feito: tudo do bloco HOJE abaixo. Cliente espera de nós: a página do Acervo para aprovar (sem hora prometida). Nós esperamos: Lucas confirmar horário da construtora; Josué (valor da reunião 13h, chamado 20261127-085752-6cb876; conta de pagamento); esteira consertada. Promessas/jobs: 11:00 (20261127-1100) conferir construtora; 02/12 09:00 (20261202-0900). PRÓXIMO PASSO ao acordar: ler ~/contexto-clientes/lucas-portela/2026-11-27.md; esteira ok = líder com os 3 prints e envio dos faltantes com lease/--seco.
## HOJE 27/11 — conversa e estado
- O que o Lucas disse: 08:56 "Isso" (construtora hoje 13h) + "Vou confirmar com ele"; 08:57 "Na verdade é uma reunião para entender melhor o que ele precisa e tentar fechar o valor"; 08:57 "Vamos fazer esse" (respondendo à sugestão das 08:30 = Acervo Trabalhista IA, R$ 67, 7 dias).
- O que saiu (zap, celular, lease tmux:p:bjj, --seco): 08:28-08:30 as 3 perguntas (demo / nome-preço-garantia / sugestão); 08:57 "entendi, me avisa quando ele confirmar o horario"; 08:58 "fechado, vou aplicar na pagina" (revisar APROVADO). Nenhuma imagem foi enviada hoje.
- Feito: página do Acervo aplicada (vademecum-trabalhista f5351ae: nome, R$ 67, garantia no card e FAQ, sem faixa de prévia; prints previa/landing-celular.png, landing-pc.png, clique-quero.png). Chamado ao Josué sobre o valor da construtora (20261127-085752-6cb876). RESUMO.md atualizado. P1125-1 e P1125-2 em aguardando com nota.
- Falta: (1) P1125-1: Lucas confirmar o horário com a construtora; Josué dizer se entra na reunião das 13h ou passa a faixa de preço (valor é dele, nada de preço ao Lucas). (2) P1125-2: líder travado por defeito da esteira (revisor remoto não lê imagem; infra consertando); conta de pagamento p/ o botão Comprar (hoje #) é do Josué; depois os 3 prints ao Lucas aprovar.
- Próximo passo com hora: 11:00 job 20261127-1100 acorda p:bjj p/ conferir se o Lucas confirmou o horário da construtora (sem resposta = avisar p:gerente-atendimento, sem novo toque). 13:00 reunião com a construtora (Josué/Lucas). Esteira voltando: conferir `zap log`, rodar o líder com os 3 prints, aprovado = lease + zap imagem --seco + envio só dos faltantes. 02/12 09:00 job 20261202-0900 pausa P1028-1/P1114-1/P1116-1 se o dono calar.
- Lição: `pedidos <c> <id> <estado> "nota"` (nota sem flag; com --nota gravou só "--nota").

## Notas anteriores (08:3x)
> Ata gerente 27/11: demo confirmada = faz, sem precisar dele. Job 20261127-1100 acorda p:bjj para conferir; sem resposta = avisar p:gerente-atendimento, sem novo toque.
> P1028-1, P1114-1, P1116-1: decisão pedida ao dono numa mensagem só (chamado 20261127-081758-94ffb1). Sem resposta até 02/12 = pausar com nota (job 20261202-0900). Nada sobre eles foi ao Lucas (P1028-1 é fio jurídico).
> Jobs 27/11 09:00 (toque leve) e 12:30 cancelados (obsoletos). FATOS.md do revisor ganhou a fala do Lucas 25/11 19:35 (demo 13h).
> COCHILO 27/11 ~08:5x. Feito: 3 msgs ao Lucas 08:30 (demo 13h mantida? / nome-preço-garantia do Acervo / sugestão R$ 67, 7 dias, ele decide); chamado ao dono 20261127-081758-94ffb1 (P1028-1, P1114-1, P1116-1).
> Cliente espera de nós: nada prometido com hora. Nós esperamos dele: confirmar a demo de hoje 13h (P1125-1, prazo 11:00) e escolher nome/preço/garantia (P1125-2).
> Promessas/jobs com hora: 27/11 11:00 (20261127-1100) acorda p:bjj p/ conferir a demo; 02/12 09:00 (20261202-0900) pausa os 3 vencidos se o dono calar.
> PRÓXIMO PASSO ao acordar: ler ~/contexto-clientes/lucas-portela/2026-11-27.md. Demo confirmada = fazer às 13h (sem gerente). Veio nome/preço/garantia = aplicar na página do vademecum-trabalhista, tirar banner/rótulos de prévia, ligar checkout, rodar esteira, só então avisar o Lucas.


## Tarefa em andamento: P1125-2, produto do Lucas "Acervo Trabalhista para IA" (estado: aguardando)
- PRONTO: ~/dev/clientes/lucas-portela/vademecum-trabalhista (git local, último commit "agente como proposta de 2ª etapa").
  `scripts/montar.py` monta `acervo/` (41 normas do ~/dev/ferramentas/leis-brasil: CF, CLT, 13.467, leis especiais, previdência,
  processo, CC, LGPD) + `_catalog.json`; `prompts/` (5 perfis), `roteador-de-temas.md`, `COMO_USAR_NA_IA.md`, `agente/README.md`
  (degrau 2: SÓ roteiro, agente NÃO montado), `site/index.html` (página de venda = PRÉVIA com banner e rótulos "sugestão"),
  `previa/landing-390x2600.png` e `landing-1280x2300.png`, zip em `dist/` (não versionado). Não cobre NRs, súmulas do TST, convenções.
  10 das normas estão em versão `original` (campo `versao_texto`).
- Cadastro da esteira: `~/atendimento/nucleo/clientes/lucas-acervo-trabalhista.conf` (marcador "projeto interno", sem DESTINOS,
  JANELA p:bjj) + `~/atendimento/atendimento-lucas-acervo-trabalhista/REGRAS.md`. Criado a mando do gerente.
- Esteira: `LIDER_PROJETO=<pasta> ~/atendimento/nucleo/lider revisar lucas-acervo-trabalhista --pedido P1125-2 --prints ... --nota "..."`.
  4 rodadas reprovadas (identidade BJJ; preço parecer fechado; agente "já pronto"; portão barato barrou os rótulos de sugestão).
  Roda ~3-5 min: usar run_in_background, saída no scratchpad.

## Decisões (gerente, chamados 20261126-105235-e00d1e e 20261126-110658-a97836)
- Esteira estava certa em barrar a identidade; produto tem cadastro próprio.
- Prévia da reunião é INTERNA, sem esteira; Josué mostra na tela. Esteira SÓ na versão final com nome/preço/garantia escolhidos pelo Lucas.
- Produto em 2 degraus: base = acervo .md (~R$67), acima = agente pronto mensal. Nome, preço e garantia NÃO decididos.
- 3 perguntas ao Lucas na reunião: nome (A "Acervo Trabalhista IA", B com "por Lucas Portela"), preço (sug. R$67, ref. concorrente
  advocacia100x), garantia (sug. 7 dias, CDC). Texto: ~/atendimento/atendimento-lucas-portela/material/2026-11-26-reuniao-3-perguntas-acervo.md.

## Pendências / PRÓXIMO PASSO
1. Reunião REMARCADA para ~13h-14h de 26/11 (Lucas áudio 10:00; Josué respondeu 10:03 "beleza pode ser sim"; horário exato não confirmado). Josué conduz.
2. Depois da reunião: ler `~/contexto-clientes/lucas-portela/2026-11-26.md`; aplicar nome/preço/garantia; tirar banner e rótulos da página;
   ligar checkout (botão "Comprar" hoje aponta para #); montar o agente se o Lucas quiser; rodar a esteira; mover P1125-2 e P1125-1 (demo sex 27/11 13h).
3. Avisar o Lucas só depois da esteira APROVADA: lease `asteron-ops lock acquire lucas-portela tmux:p:bjj`, `zap enviar lucas-portela --seco`, `revisar --cliente lucas-portela`, liberar o lease.
4. Vencidos de 25/11 10:00, vez do JOSUÉ (a sessão não manda nada): P1028-1 contrato/aditivo, P1114-1 chave R2 só-escrita, P1116-1 ok classe C do item 3.

## Prometido com hora
- Toque leve sex 27/11 09:00 (job `20261127-0900-toque-leve-lucas-hor-rio-da-de`, acorda p:bjj): 1 linha só se o horário da demo ainda não veio. O lembrete interno das 09:30 de hoje ficou obsoleto.
- Prazo do P1125-2: 26/11 20:05. NADA foi prometido ao Lucas hoje; nada enviado (Josué falou com ele pelo celular).

## Regras que não mudam
- Falar com ele só por `zap` (+ `--seco`, `revisar`, lease como `tmux:p:bjj`). Primeira pessoa, curto, sem lista/negrito. Eu sou o Josué para o cliente.
- Fio JURÍDICO/pessoal (contrato 4 anos, processo, aluguel) é do Josué. Preço/escopo/credencial = Josué/gerente (classe C); Lucas NÃO é cobrado pelo BJJ.
- Repo é PÚBLICO: nunca commitar senha, .env, .db, e-mail de atleta. Teste de código só via `teste` ou sandbox.
- Lições: `pedidos` usa estados novo/fazendo/previa/aguardando; `julgar` → JOSUE → `chamar-josue` (vai ao gerente); `$TMPDIR` vem vazio, usar o scratchpad.

## Onde está cada coisa (BJJ Replay, medido)
- Principal: bjjreplay.com.br = pm2 `bjj-replay-front`/`back` em /opt/bjj-replay/bjjreplay.com.br no bjjserver (167.88.44.199); `ssh bjjserver` (se cair, `-J aws-pesado`); sem `rg` lá. Banco `back/data/volt.db`.
- ENTREGA_EXPIRA_DIAS=7 só no env salvo do pm2. Desfazer: /root/backups/desfazer-P1116-1.sh. Rotas do Mac: /api/service/*; R2 `bjj-replay/alliance-parnaiba/<atletaId>/...mp4`.
- Campeonato: /opt/bjj-replay/campeonato; aviso diário 19h `#PAUSADO-16-11`; AVISOS_ENTREGA_SUSPENSOS=1 de propósito.
- Deploy: backup em /root/backups + `rsync -anci` + build + deploy/pm2/sync-standalone.sh + conferir `_next/static` 200 + pm2 restart + pm2 save. Nunca `pkill -f`.
- Atendimento: ~/atendimento/atendimento-lucas-portela (REGRAS.md, PEDIDOS.md, RESUMO.md, material/). Daily: ~/atendimento/daily/2026-11-26/p_bjj.md (ainda não escrito hoje).

## NÃO FAZER
- Falar valor por iniciativa própria, se passar por cliente, mandar demo de outra cliente, reverter por git no servidor sem backup, mandar "só passando", contornar a esteira/Guarda.
