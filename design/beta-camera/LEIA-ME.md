# Aviso "olhe para a câmera preta" (bloco D, P1104-12)
Texto (o Lucas aprova a versão final): "Antes de lutar, olhe para a câmera preta." / "2 segundos, rosto sério." / "Sem sorrir. Sem mão, cabelo ou boné na frente do rosto."
- Digital: `aviso-banner-1600x500.png|svg`, `aviso-quadrado-1080x1080.png`, `aviso-vertical-1080x1920.png` (stories; conteúdo entre y 190 e 1720).
- Animação 4 s em loop, sem som: `aviso-camera-preta.mp4|webm` (1280x720, ~50 KB) + `.gif` (reserva) + `-poster.png`.
- Impresso: `aviso-cartaz-A3-com-sangria.pdf` — página 323x446 mm = A3 297x420 + 3 mm de sangria + 10 mm de área de marcas de corte. Vetorial. Cores em RGB: a gráfica converte para CMYK (fundo = preto rico). As fontes saem como Type 3 do Chromium; peça à gráfica para conferir/converter em curvas.
- Ilustração: atleta genérico desenhado à mão (SVG), sem foto de aluno. Código: `src/` (`partes.py`, `anim.py`, `pecas.py`; `python src/gerar_pecas.py`).
- No site: `front/components/beta/AvisoCameraPreta.tsx` (banner em Biblioteca e Minha luta; boas-vindas dismissível), assets em `front/public/beta/`.
- Sem QR nem link neste bloco. SVG do banner usa Barlow Condensed/Inter (cai em Impact/Arial sem elas).
