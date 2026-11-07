# App + aba paga de monitoramento: o que conectar no backend e o que as lojas dizem

Versão de 07/11/2026. Resposta ao pedido do Lucas (13:05 e 13:11): app tipo rede social, aba PAGA de monitoramento/gravação ligada a servidor e câmeras locais do cliente, assinatura gerida só no site, app só autentica e consulta se a assinatura está ativa.

Parte 1 é técnica (o que conectar). Parte 2 são as regras das lojas, com fonte e com o risco dito sem enfeite. **Nada aqui promete aprovação.**

---

## Parte 1 — Backend

### 1.1 Visão geral

```
[Site] --Pix/cartão--> [Gateway] --webhook--> [Servidor central] <--login/licença-- [App]
                                                   |                                  |
                                          assina o token de licença                   | HTTPS/WSS (token no header)
                                                   v                                  v
                                        [Túnel reverso] <------- [Servidor local do cliente (câmeras/gravação)]
```

Princípios:

1. **Quem manda na assinatura é o servidor central.** O app e o servidor local nunca decidem sozinhos.
2. **O app não tem preço, botão, link nem texto de pagamento.** Só mostra "ativo" ou "bloqueado".
3. **O servidor local confere a licença offline** (chave pública), então câmera e gravação não dependem da internet do cliente.
4. **Nenhuma porta aberta no roteador do cliente.** O servidor local sai para fora (túnel reverso).

### 1.2 Modelo de dados

```
usuario(id, email, senha_hash, email_verificado, criado_em, excluido_em)
assinatura(id, usuario_id, plano, status, periodo_fim, gateway, gateway_ref, atualizado_em)
   status: ativa | atrasada | suspensa | cancelada
servidor_local(id, usuario_id, nome, chave_publica_dispositivo, tunel_id, ultimo_contato, revogado_em)
dispositivo_app(id, usuario_id, plataforma, push_token, ultimo_login, revogado_em)
refresh_token(id, usuario_id, dispositivo_id, hash, expira_em, usado_em, revogado_em)
licenca_emitida(jti, servidor_local_id, usuario_id, emitida_em, expira_em)   -- auditoria e revogação
evento_pagamento(id_gateway, tipo, payload, processado_em)                   -- idempotência do webhook
```

Regras:

- `assinatura` é por usuário (ou por organização, se um cliente tiver vários operadores). Um `servidor_local` só pertence a uma conta.
- Guardar só o **hash** do refresh token. Rotação a cada uso; reuso de token antigo revoga a família inteira.
- `evento_pagamento.id_gateway` é único: webhook repetido não ativa duas vezes.

### 1.3 Endpoints

Autenticação do app:

| Método e rota | Função |
| --- | --- |
| `POST /auth/login` | e-mail + senha (ou OTP). Devolve `access_token` (JWT 15 min) + `refresh_token` (30 dias, rotativo). |
| `POST /auth/refresh` | troca refresh por novo par. |
| `POST /auth/logout` | revoga o refresh do dispositivo. |
| `DELETE /conta` | exclusão de conta **dentro do app** (exigência da Apple, ver 5.1.1(v)). Apaga ou anonimiza e cancela a assinatura no gateway. |

Licença (o app só pergunta, nunca cobra):

| Método e rota | Função |
| --- | --- |
| `GET /licenca` | devolve `{ ativa: true|false, ate: <data>, servidores: [ids] }`. **Sem preço, sem plano, sem link.** |
| `POST /licenca/token` | body `{ servidor_id }`. Se a assinatura está ativa e o servidor é da conta, devolve o **token de licença** (JWT assinado, 1.4). Se não, `403` com `{ ativa:false }`. |
| `POST /licenca/revogar` | (admin/site) invalida servidor ou dispositivo: marca `revogado_em` e entra na lista de revogação. |
| `GET /licenca/revogados` | lista curta de `jti`/`servidor_id` revogados, consumida pelo servidor local quando tem internet. |
| `GET /.well-known/jwks.json` | chave(s) pública(s) com `kid`, para rotação sem redeploy. |

Servidor local (autentica com chave própria, não com a conta do usuário):

| Método e rota | Função |
| --- | --- |
| `POST /servidores/registrar` | pareamento com código de uso único gerado no site. Devolve `tunel_id` + credencial do túnel. |
| `POST /servidores/heartbeat` | a cada poucos minutos: versão, saúde, `ultimo_contato`. |

Pagamento:

| Método e rota | Função |
| --- | --- |
| `POST /webhooks/pagamento` | recebe do gateway (Asaas, Mercado Pago, Stripe). Valida assinatura do webhook, grava em `evento_pagamento` (idempotente), muda `assinatura.status`. |

### 1.4 Webhook do pagamento → ativar/suspender

| Evento do gateway | Efeito |
| --- | --- |
| pagamento confirmado | `status=ativa`, `periodo_fim = fim do ciclo` |
| cobrança vencida | `status=atrasada` (mantém por alguns dias de tolerância, definir) |
| vencida além da tolerância / cancelamento | `status=suspensa` ou `cancelada` e **entra na lista de revogação** |
| estorno / chargeback | `status=suspensa` |

Idempotente (id do evento único), valida a assinatura do webhook e **sempre consulta o gateway** antes de ativar quando o payload for duvidoso. Falha no processamento devolve 5xx para o gateway reentregar.

### 1.5 Token de licença

JWT curto assinado pelo servidor central.

- **Algoritmo:** EdDSA (Ed25519) ou RS256. Chave privada só no servidor central; chave pública embutida no servidor local e publicada no JWKS (com `kid` para rotação).
- **Validade:** 15 min para o token de acesso do app. Para o **servidor local**, emitir também uma **licença de servidor** com validade maior (ex.: 24 h a 7 dias, ver período de graça).
- **Claims:**

```json
{
  "iss": "https://api.seudominio.com",
  "sub": "usr_123",
  "aud": "srv_456",          // servidor local de destino
  "jti": "uuid",
  "iat": 1762500000, "nbf": 1762499970, "exp": 1762500900,
  "scope": ["monitor:ver", "monitor:gravacoes"],
  "ativa": true,
  "plano": "monitoramento"
}
```

- **O servidor local valida sozinho:** assinatura (chave pública), `aud` = o próprio id, `exp`/`nbf`, `scope`. Sem chamar o central a cada requisição.
- **Relógio:** tolerância de 60 a 120 s em `nbf`/`exp`. Se o relógio do servidor local estiver muito errado, aceitar só com o horário obtido por NTP, e nunca mover a data para trás sem alarme.
- **Revogação:** como o token é curto, a revogação "de verdade" é não renovar. Para corte imediato, o servidor local consulta `GET /licenca/revogados` quando tem internet.

### 1.6 Sem internet: período de graça

Decisão de produto (sugestão, é dele):

- Servidor local guarda a **última licença válida** e o instante em que a recebeu.
- Cai a internet: continua **gravando e servindo na rede local** enquanto `agora < exp_da_licenca + graça`.
- Sugestão: licença de servidor de 72 h, graça extra de 72 h. Passou disso sem renovar, bloqueia o **acesso remoto** e avisa com mensagem neutra; **a gravação nunca para por falta de licença** (perder gravação de câmera é pior do que perder a receita de alguns dias).
- Voltou a internet: renova, tudo volta sozinho.

### 1.7 Túnel (sem abrir porta no roteador)

Opções, da mais simples para a mais controlada:

1. **Cloudflare Tunnel (`cloudflared`)**: o servidor local abre conexão de saída; o app fala com um hostname por servidor. Simples, grátis no básico. Cuidado: o termo de uso da Cloudflare restringe vídeo em escala no plano gratuito, **conferir antes** de apostar em streaming de vídeo por ele.
2. **WireGuard**: servidor local e app entram numa rede privada com um nó central. Mais controle e menos dependência de terceiros, mais trabalho de operação.
3. **frp / rathole**: túnel reverso autohospedado num VPS seu. Controle total, você opera.

Regras comuns:

- Credencial do túnel **por servidor**, revogável (`servidor_local.revogado_em`).
- O app **nunca** recebe o endereço antes de a licença ser validada.
- Tráfego em TLS (HTTPS/WSS); o servidor local ainda confere o token de licença em cada conexão (defesa em profundidade, o túnel sozinho não autentica ninguém).
- Vídeo ao vivo/gravado: HLS ou WebRTC sobre o túnel. Medir banda de subida do cliente antes de prometer qualidade.

### 1.8 Tela de login e aba bloqueada

Login:

- Só e-mail e senha (ou código por e-mail). **Sem "criar assinatura", sem "ver planos", sem "assinar no site".**
- Texto neutro: "Entre com a conta que você já tem."
- Cadastro pode existir (conta gratuita da rede social). Se existir, precisa de **exclusão de conta dentro do app**.
- "Esqueci a senha" abre fluxo de redefinição, não pagamento.

Aba bloqueada (assinatura inativa):

- Opção A (mais segura): **a aba nem aparece**.
- Opção B: aparece com mensagem neutra: "Este recurso não está disponível para a sua conta. Em caso de dúvida, entre em contato com o suporte."
- **Não colocar:** preço, nome de plano, "assine", "contrate", "grátis por X dias", e-mail ou site de venda. E não contornar com texto que *induza* a ir pagar fora: o revisor lê o conjunto.

### 1.9 Conta e servidor de demonstração para os revisores

Exigência das duas lojas (Apple 2.1(a): conta demo **e o back-end ligado**).

- Conta de revisão com assinatura **sempre ativa** (flag `demo=true`, sem gateway), nunca expira.
- **Servidor de homologação** na nuvem com câmeras simuladas (arquivos de vídeo em loop, RTSP falso) para o revisor ver a aba funcionando **sem ter hardware**. É o ponto que mais derruba.
- O servidor de demonstração fica **ligado 24 h** durante a revisão (a revisão pode ser em qualquer horário).
- **Vídeo gravado** (2 a 3 min, em inglês legendado ou com texto): login, aba ativa mostrando câmeras, o que é o servidor local, e a conta sem assinatura vendo a aba bloqueada. Anexar nas notas de revisão da App Store Connect e no Play Console.
- Notas de revisão (escritas): explicar que o serviço depende de **servidor e câmeras físicos do cliente**, que a contratação é do **serviço** (instalação, suporte, hardware) no site, e que o app só autentica.

### 1.10 Checklist de submissão

- [ ] Nenhuma tela do app com preço, plano, "assinar", link ou QR de pagamento
- [ ] Nenhum link do app para página de checkout; textos de loja (descrição, capturas) sem chamada para pagar fora
- [ ] Login com conta do site funcionando; exclusão de conta dentro do app
- [ ] Política de privacidade (URL válida) cobrindo vídeo/câmera, dados de terceiros filmados e LGPD
- [ ] Conta demo + servidor de homologação ligado + vídeo anexado
- [ ] Notas de revisão explicando o hardware do cliente e a contratação fora do app
- [ ] App Store Connect: Privacy Nutrition Labels preenchidas; Play Console: Data Safety e declaração de uso de câmera/vídeo
- [ ] Teste com assinatura ativa, atrasada, suspensa, sem internet e relógio errado
- [ ] Teste de revogação (suspender no site e ver o app bloquear)
- [ ] Funcionalidade além de "site empacotado" (Apple 4.2): a parte de rede social precisa ter valor próprio
- [ ] Decisão consciente sobre o Plano B (1.11) antes de submeter

### 1.11 Plano B se a Apple/Google exigirem compra no app

Se o revisor entender que a aba é conteúdo digital: (a) responder no Resolution Center explicando o hardware (ver Parte 2); (b) se mantiver a recusa, oferecer **IAP/Play Billing** só na loja correspondente (a assinatura do site continua valendo, 3.1.3(b)), ou (c) usar o link externo onde ele é permitido (EUA, e Brasil conforme Parte 2), com as comissões descritas lá. Vale deixar o backend pronto para aceitar **recibo da loja** como mais uma origem de `assinatura` (campo `gateway` já prevê).

---

## Parte 2 — Regras das lojas (pesquisadas em 07/11/2026)

> Isto não é parecer jurídico nem garantia. As lojas mudam as regras e os revisores interpretam caso a caso. Conferir o texto vigente na hora de submeter.

### 2.1 Apple — App Review Guidelines
Fonte: <https://developer.apple.com/app-store/review/guidelines/>

**3.1.1** (a regra geral que pega a assinatura):
> "If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase. Apps may not use their own mechanisms to unlock content or functionality, such as license keys, augmented reality markers, QR codes, cryptocurrencies and cryptocurrency wallets, etc."

**Risco real:** "license keys" aparece na lista. Um token de licença que destrava uma aba paga pode ser lido exatamente como "mecanismo próprio para destravar funcionalidade". É o ponto mais exposto da arquitetura.

**3.1.3 (Other Purchase Methods)**, exceções que poderiam servir:
- **(a) Reader apps:** só magazines, jornais, livros, áudio, música e vídeo "previamente comprados". Monitoramento de câmera **não** é essa categoria. Não serve.
- **(b) Multiplatform Services:**
  > "Apps that operate across multiple platforms may allow users to access content, subscriptions, or features they have acquired in your app on other platforms or your web site, including consumable items in multi-platform games, provided those items are also available as in-app purchases within the app."
  A condição final é **"provided those items are also available as in-app purchases within the app"**. Ou seja, a 3.1.3(b) só cobre o app que **também vende aquilo por IAP**. Sem IAP, não vale. Esta é a pegadinha: ela não autoriza o modelo "só site".
- **(c) Enterprise Services:** só se o app é vendido **diretamente a organizações** para funcionários. Cliente pessoa física/família precisa de IAP. Só serve se o produto for B2B puro.
- **(e) Goods and Services Outside of the App:**
  > "If your app enables people to purchase physical goods or services that will be consumed outside of the app, you must use purchase methods other than in-app purchase..."
  Serve para o que é consumido **fora** do app. Monitoramento visto *dentro* do app dificilmente cabe aqui.
- **(f) Free Stand-alone Apps:** só para companion de ferramenta web paga de VoIP, armazenamento em nuvem, e-mail ou hospedagem, "provided there is no purchasing inside the app, or calls to action for purchase outside of the app". Gravação em nuvem poderia ser argumento, mas é um enquadramento forçado, e exige **zero** chamada para compra.

**3.1.4 (Hardware-Specific Content)**: o argumento mais forte do Lucas:
> "In limited circumstances, such as when features are dependent upon specific hardware to function, the app may unlock that functionality without using in-app purchase (such as an astronomy app that adds features when synced with a telescope)."
O exemplo do telescópio é parecido com "app que só funciona com o servidor e as câmeras do cliente". **Mas** o texto diz "limited circumstances" e fala em *hardware específico*; se o hardware for genérico (câmera IP qualquer) e o que se vende for **assinatura de software**, o revisor pode negar. Ajuda muito: hardware **vendido/instalado por você**, servidor próprio, e o app **não fazer nada** sem ele.

**3.1.2(a)**: assinaturas de SaaS e "cloud support" são consideradas válidas **como assinatura via IAP**; reforça que o padrão da Apple é IAP.

**Outras que pesam:**
- **2.1(a):** exige conta demo e back-end ligado; demo mode só com aprovação prévia da Apple.
- **5.1.1(v):** se há criação de conta, tem de haver exclusão **dentro do app**. Se não há recurso significativo ligado a conta, deve funcionar sem login.
- **4.2:** o app precisa ir além de "site empacotado".

### 2.2 Apple — links para compra fora do app
- **EUA:** o próprio texto da 3.1.1(a) diz que as entitlements "are not required" para incluir botões e links externos na storefront dos EUA. Ou seja, nos EUA o app pode apontar para o site. Litígio Epic x Apple ainda em curso (Suprema Corte aceitou revisão limitada em 30/06/2026, segundo reportagem); regras de comissão por link ainda disputadas. Fonte: [3.1.1(a)](https://developer.apple.com/app-store/review/guidelines/) e [TechCrunch, 14/08/2026](https://techcrunch.com/2026/08/14/apple-proposes-to-take-a-15-cut-of-purchases-made-outside-the-app-store/).
- **Brasil (novo, muda o jogo):** em 18/06/2026 a Apple anunciou mudanças no iOS no Brasil (acordo com o CADE, iOS 26.5): permite meio de pagamento alternativo no app e **link para o site** concluir a compra. Comissão de **15%** (10% para elegíveis) sobre compras feitas pelo site linkado; pagamento alternativo sempre ao lado do IAP; apps da categoria Kids e usuários menores de 18 anos **não podem** ter link para site de transação. Fonte: [Apple Newsroom](https://www.apple.com/newsroom/2026/06/apple-announces-changes-to-ios-in-brazil/). Exige o entitlement StoreKit (fontes secundárias; a página da Apple não detalha), então **confirmar na documentação oficial de desenvolvedor**.
  - Isso é **o oposto** do que o Lucas quer (app sem nenhum link). Mostra que: (1) sem link, o app segue o modelo "nada de pagamento no app"; (2) com link no Brasil, **Apple cobra comissão** sobre a venda feita pelo site.

### 2.3 Google Play — Payments policy
Fonte: <https://support.google.com/googleplay/android-developer/answer/9858738>
- Seção 2: transações digitais (assinatura, funcionalidade, serviço em nuvem) devem usar o Play Billing, salvo exceções.
- Seção 3: **não** usar Play Billing para bens físicos e serviços físicos (transporte, academia, entrega, ingressos).
- Seção 4: o app "may not lead users to a payment method other than Google Play's billing system" (listing, promoções, webviews, botões, links, anúncios e fluxos de cadastro), salvo exceções das seções 3, 8 e 9.
- Seções 8 e 9: programas de billing alternativo/ofertas externas em regiões elegíveis, mediante adesão.

**Risco:** monitoramento/gravação é serviço digital consumido no app; o Google pode exigir Play Billing. O argumento do hardware local é mais fraco aqui do que na Apple (não há equivalente direto da 3.1.4 que eu tenha confirmado na página consultada).

**Brasil:** o Google lista o Brasil entre os mercados de "user choice billing" (escolha de sistema de cobrança por compra), com taxa reduzida no programa antigo; a reformulação de 30/06/2026 começou por EUA, EEE e Reino Unido, com expansão futura. **Não encontrei página oficial de 2026 específica do Brasil**: confirmar no Play Console antes de decidir. Fontes: [Google Play Help](https://support.google.com/googleplay/answer/11174377), [Android Developers Blog](https://android-developers.googleblog.com/2026/06/play-expanded-billing.html), [Play Console Help](https://support.google.com/googleplay/android-developer/answer/13821247).

**"Consumption-only/reader":** não achei, na política de pagamentos do Google, uma categoria equivalente à "Reader" da Apple. Não afirmo que exista. Verificar direto com o suporte do Play Console.

### 2.4 Resumo honesto do risco

| Ponto | Avaliação |
| --- | --- |
| Assinatura digital consumida no app, destravada por token de licença | **Risco alto.** Cai na 3.1.1 (inclusive "license keys") e na Payments policy do Google. |
| 3.1.3(b) Multiplatform | **Não salva** sozinha: exige que o item também exista como IAP no app. |
| 3.1.3(a), (c), (d), (e) | Não se encaixam (ou só se encaixam se o produto for B2B puro / serviço consumido fora do app). |
| **3.1.4 hardware** | **Argumento mais forte**: o app só funciona com servidor/câmeras físicos do cliente. Não é garantia; depende de o hardware ser seu, específico e o app inútil sem ele. |
| Apple: link externo | Permitido nos EUA; no Brasil desde 18/06/2026, com comissão de 15% e restrição a menores. |
| Google: link externo | Só via programas elegíveis; Brasil a confirmar. |

**O que melhora as chances (sem prometer):**
1. Vender no site o **pacote** (servidor/câmeras instalados + suporte), e não "uma assinatura de app". O app é só o controle remoto do hardware.
2. App útil sem a aba paga (a parte "rede social" tem de ter valor próprio, ver 4.2).
3. Notas de revisão claras, conta demo, servidor demo e vídeo.
4. Prazo e orçamento para **plano B**: se a revisão negar, ter IAP/Play Billing ou link externo (onde permitido) pronto para ligar.
5. Se o cliente for empresa, vender como B2B (3.1.3(c)).

**O que piora:** texto "assine", preço, "plano premium", app que desbloqueia sozinho conteúdo de nuvem sem hardware nenhum, ou revisor que não consegue ver a aba funcionando.

---

*Quando for submeter, vale conferir o texto vigente das duas políticas no dia, porque os dois lados estão mudando por decisão judicial e acordo regulatório em 2026.*
