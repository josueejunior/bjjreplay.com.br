# lucas-portela (BJJ Replay) — onde parei (26/11/2026 ~11:30, renovação de contexto; cochilo 11:30: sem mudança, nada enviado, enviadas.log vazio)
> Próximo passo ao acordar: se for depois da reunião (~13h-14h), ler ~/contexto-clientes/lucas-portela/2026-11-26.md e seguir "Pendências" 2-3 abaixo.

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
