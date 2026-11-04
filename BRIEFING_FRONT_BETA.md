# BJJ Replay Beta — briefing para o front

28/10/2026 · Lucas Portela

No beta da academia o BJJ Replay não cobra nada, e o site ganha duas abas novas (uma para o aluno ajudar a melhorar o sistema e outra para avisar que uma luta dele não apareceu) e um aviso visual para o aluno olhar para a câmera preta antes de lutar.

## Beta sem cobrança

Durante o beta todo aluno da academia com cadastro facial e consentimento recebe as próprias lutas, sem pagar. Isso suspende, só no beta, a regra de 21/09 "só entrega lutas de pagantes".

- Sem checkout, preço ou paywall nas telas do aluno; nenhum botão "assinar".
- Selo visível **Beta gratuito** no topo, com uma frase: "Estamos testando na academia. Sua ajuda melhora o sistema."
- Liberação: o site não filtra por `pago` enquanto o beta estiver ligado. Continua exigindo cadastro com foto aprovada e consentimento biométrico.
- Uma chave de configuração no site (ex.: `BETA_GRATUITO=true`) liga e desliga isso, para voltar à cobrança sem nova versão.
- Lutas entregues no beta continuam do aluno depois que o beta acabar.

## Aba "Ajude a melhorar"

A aba junta duas tarefas curtas que o aluno faz depois da aula. As respostas viram gabarito para medir e corrigir o sistema; nada é obrigatório.

**1. Quantas lutas você fez?** Por aula em que o aluno esteve (data + horário da grade):

- O site mostra "O sistema encontrou N lutas suas nesta aula".
- O aluno responde: está certo / fiz mais / fiz menos, e quantas fez de verdade.
- Opcional: com quem lutou em cada uma (busca no cadastro da academia ou texto livre).
- Se ele disser "fiz mais", o site oferece abrir "Minha luta não foi encontrada" já preenchido.

**2. Perguntas do Córtex** (já existe no protótipo do Mac e no app iOS como `RevisaoLancesView`):

- O Córtex marca lances na luta (ex.: uma batida de finalização) e gera perguntas.
- O aluno vê o trecho com ±15 s de contexto e uma janela de foco de 3–5 s destacada em verde; fora dela fica escurecido com borda vermelha.
- Pergunta neutra, sem sugerir a resposta: "O que aconteceu no trecho verde?", com opções + "não sei".
- Só os dois atletas daquela luta recebem as perguntas dela.
- Contador simples de contribuições ("Você ajudou em 12 lutas"), sem ranking público.

## Aba "Minha luta não foi encontrada"

O aluno avisa que lutou e a luta não apareceu; o Mac da academia procura de novo nas gravações. O prazo é de **3 dias**, porque o gravador da academia guarda o vídeo completo por cerca de 4 dias.

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| Data da aula | data (hoje e até 3 dias atrás) | sim |
| Aula | lista com os horários de adulto da grade daquele dia | sim |
| Tatame | lista (hoje só Tatame 1) | sim |
| Horário aproximado da luta | hora:minuto | não |
| Com quem lutou | busca no cadastro da academia ou texto livre | não |
| Quantas lutas faltaram | número | sim |
| Observação | texto curto (até 280 caracteres) | não |

Status que o aluno acompanha na própria aba:

1. **Recebido** — o pedido chegou ao site.
2. **Procurando** — o Mac pegou o pedido.
3. **Encontrada** — a luta aparece na lista dele, com link.
4. **Não encontrada** — com o motivo em linguagem simples (ex.: "fora do campo das câmeras", "vídeo já apagado").

Pedido fora do prazo: o site avisa antes de enviar que o vídeo pode já ter sido apagado, mas aceita.

## Aviso visual: olhe para a câmera preta

Antes de cada luta, o aluno olha por 2 segundos para a câmera preta, com rosto sério e sem nada na frente. É o que mais ajuda o sistema a reconhecer quem está lutando e a encontrar a luta dele.

**Pedido ao dev:** criar uma imagem ilustrada e uma animação curta com um atleta de kimono, antes da luta, olhando de frente para a câmera preta.

Texto do aviso (o Lucas aprova a versão final):

> **Antes de lutar, olhe para a câmera preta.**  
> 2 segundos, rosto sério.  
> Sem sorrir. Sem mão, cabelo ou boné na frente do rosto.

Como deve ser:

- Atleta **ilustrado e genérico**, nunca foto de aluno real (o rosto é dado biométrico).
- Mostrar o certo e o errado lado a lado: ✓ rosto de frente e sério; ✗ sorrindo; ✗ mão ou cabelo tapando o rosto.
- Câmera desenhada em **preto**, igual às da academia, com uma seta ou brilho indicando para onde olhar.
- Cores da marca: azul-kimono #0B3A7E, preto-faixa #0A0A0C, vermelho-ponteira #B71E25, branco #FEFEFD.
- Animação de 3–5 s em loop, sem som: o atleta chega, para, olha para a câmera, aparece o ✓.

Formatos e onde aparece:

| Peça | Formato | Onde |
| --- | --- | --- |
| Banner | 1600×500 PNG/SVG | topo de "Minhas lutas" e da aba "Minha luta não foi encontrada" |
| Animação | MP4/WebM leve + GIF de reserva | boas-vindas do beta e telas do aluno |
| Quadrado | 1080×1080 | post e grupo da academia |
| Vertical | 1080×1920 | stories |
| Cartaz | A3 para imprimir | parede da academia, perto da câmera |

## Vídeo da luta: 1 minuto antes e depois

O vídeo entregue passa a começar 1 minuto antes e terminar 1 minuto depois da luta detectada (antes eram 4 segundos). O arquivo fica maior e pode mostrar o fim da luta anterior ou o começo da seguinte.

- O player deve abrir já no início da luta, não no início do arquivo. O Mac manda o deslocamento em segundos (`inicio_luta_s`, `fim_luta_s`) junto com a entrega.
- Marcar no player a região da luta (início e fim) na barra de tempo.
- Mais adiante o Mac também vai mandar se a borda veio do vídeo ou do bipe do cronômetro; por enquanto é só informação, não precisa aparecer.

## Integração com o Mac da academia

O Mac não recebe chamadas da internet; ele busca o que é novo no site com o token de serviço já existente (`BJJ_SITE_SERVICE_TOKEN`), do mesmo jeito que faz hoje com upload e vetores.

| Rota (proposta) | Quem chama | Para quê |
| --- | --- | --- |
| `GET /api/service/feedback?desde=<cursor>` | Mac | Respostas novas de "quantas lutas" e das perguntas do Córtex |
| `GET /api/service/lutas-nao-encontradas?status=recebido` | Mac | Pedidos novos de luta não encontrada |
| `POST /api/service/lutas-nao-encontradas/<id>/status` | Mac | Atualiza para procurando / encontrada (com id da entrega) / não encontrada (com motivo) |
| `POST /api/service/perguntas-cortex` | Mac | Publica perguntas do Córtex de uma luta para os 2 atletas |
| `POST /api/service/entregas` (já existe) | Mac | Ganha os campos `inicio_luta_s` e `fim_luta_s` |

- Respostas com id estável e cursor, para o Mac poder repetir a busca sem duplicar.
- O Mac consulta a cada poucos minutos; não precisa de webhook.
- Nomes de rotas e campos são proposta: o dev pode ajustar e mandar o contrato, como fez em 14/09.

## Privacidade

O aluno só vê as próprias lutas e só responde sobre elas; rosto e vetor facial nunca saem do Mac para essas abas.

- Perguntas do Córtex e "quantas lutas" aparecem só para os dois atletas da luta.
- No campo "com quem lutou", a busca mostra só nome e faixa de quem é da academia, sem foto.
- O formulário não pede dado sensível (nada de documento, telefone ou foto).
- Respostas servem para medir e corrigir o sistema; o texto de consentimento do beta deve dizer isso numa frase.

## Perguntas em aberto

- [ ] Até quando vai o beta gratuito (data ou número de aulas)?
- [ ] Aluno sem cadastro facial pode usar "Minha luta não foi encontrada"? (Sugestão: não — sem o rosto o Mac não tem como achar a pessoa.)
- [ ] Textos finais das abas e do selo Beta: o Lucas aprova antes de publicar.
- [ ] O dev manda o contrato final das rotas (nomes, campos, paginação) para o Mac implementar o lado dele.

