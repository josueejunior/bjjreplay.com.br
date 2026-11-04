"""Partes vetoriais do aviso 'olhe para a câmera preta'. Tudo desenhado à mão em SVG:
atleta GENÉRICO (nunca foto de aluno: rosto é dado biométrico), câmera preta, selos ✓/✗.
Cores da marca (BRIEFING_FRONT_BETA.md): azul-kimono, preto-faixa, vermelho-ponteira, branco."""

AZUL, PRETO, VERM, BRANCO = "#0B3A7E", "#0A0A0C", "#B71E25", "#FEFEFD"
PELE, PELE_ESC, PELE_CLARA, CABELO = "#C48A5F", "#A8704A", "#D49A6F", "#15151A"
OK, NAO = "#2BB673", "#E03A3A"   # ✓ e ✗ precisam ler à distância; verde só aqui


def defs(pid=""):
    return f"""<defs>
  <linearGradient id="fundo{pid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14264B"/><stop offset="1" stop-color="{PRETO}"/></linearGradient>
  <radialGradient id="lente{pid}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3C5C9E"/><stop offset=".45" stop-color="#0C1630"/><stop offset="1" stop-color="#05070D"/></radialGradient>
  <radialGradient id="brilho{pid}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7FB0FF" stop-opacity=".55"/><stop offset="1" stop-color="#7FB0FF" stop-opacity="0"/></radialGradient>
</defs>"""


def camera(pid="", brilho=True, x=200, y=58, s=1.0):
    """Câmera de segurança PRETA, de frente (a lente olha para quem está no tatame)."""
    glow = f'<circle cx="0" cy="0" r="62" fill="url(#brilho{pid})" class="glow"/>' if brilho else ""
    return f"""<g transform="translate({x} {y}) scale({s})">
  {glow}
  <rect x="-9" y="-58" width="18" height="22" rx="3" fill="#1B2440"/>
  <rect x="-58" y="-40" width="116" height="62" rx="14" fill="{PRETO}" stroke="#2C3A66" stroke-width="3"/>
  <path d="M-62 -40 Q0 -62 62 -40 L58 -30 Q0 -48 -58 -30Z" fill="#05060A" stroke="#2C3A66" stroke-width="2"/>
  <circle cx="0" cy="-8" r="27" fill="#0E1426" stroke="#3B4B7A" stroke-width="4"/>
  <circle cx="0" cy="-8" r="18" fill="url(#lente{pid})"/>
  <circle cx="-6" cy="-14" r="5" fill="{BRANCO}" opacity=".85"/>
  <circle cx="42" cy="-26" r="4.5" fill="{VERM}"/>
</g>"""


def seta(x, y):
    """Seta branca apontando para a lente (da esquerda)."""
    return f"""<g transform="translate({x} {y})" fill="{BRANCO}"><path d="M0 -7 H34 V-16 L54 0 L34 16 V7 H0Z"/></g>"""


def corpo():
    """Tronco de kimono azul, gola branca em V e faixa preta com ponteira vermelha."""
    return f"""<g>
  <path d="M52 440 L62 340 Q96 302 160 292 L240 292 Q304 302 338 340 L348 440Z" fill="{AZUL}"/>
  <path d="M160 288 L202 398 L244 288 L226 288 L202 350 L178 288Z" fill="{BRANCO}"/>
  <path d="M160 288 L202 398" stroke="#C8D2E8" stroke-width="2" fill="none"/>
  <rect x="52" y="414" width="296" height="22" fill="{PRETO}"/>
  <rect x="290" y="414" width="44" height="22" fill="{VERM}"/>
  <rect x="178" y="256" width="44" height="42" fill="{PELE_ESC}"/>
</g>"""


def cabeca(expr="serio", olhar=(0, -3)):
    """expr: serio | sorrindo | coberto.  olhar: deslocamento das pupilas (x, y)."""
    ox, oy = olhar
    base = f"""<ellipse cx="138" cy="196" rx="11" ry="19" fill="{PELE_ESC}"/><ellipse cx="262" cy="196" rx="11" ry="19" fill="{PELE_ESC}"/>
<ellipse cx="200" cy="190" rx="62" ry="75" fill="{PELE}"/>
<path d="M137 176 Q136 108 200 106 Q264 108 263 176 Q248 140 200 136 Q152 140 137 176Z" fill="{CABELO}"/>"""
    nariz = f'<path d="M200 190 L193 216 Q200 221 207 216" stroke="{PELE_ESC}" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    if expr == "sorrindo":
        olhos = f"""<path d="M162 184 Q176 172 190 184" stroke="{CABELO}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M210 184 Q224 172 238 184" stroke="{CABELO}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M164 160 L188 156 M212 156 L236 160" stroke="{CABELO}" stroke-width="5" stroke-linecap="round"/>"""
        boca = f"""<path d="M168 226 Q200 268 232 226Z" fill="#7A2E2E"/><path d="M176 228 Q200 244 224 228Z" fill="{BRANCO}"/>"""
        return base + olhos + nariz + boca
    olhos = f"""<path d="M162 168 L190 165 M210 165 L238 168" stroke="{CABELO}" stroke-width="5.5" stroke-linecap="round"/>
<ellipse cx="176" cy="184" rx="13" ry="8.5" fill="{BRANCO}"/><ellipse cx="224" cy="184" rx="13" ry="8.5" fill="{BRANCO}"/>
<g class="pu" transform="translate({ox} {oy})"><circle cx="176" cy="184" r="5.5" fill="{CABELO}"/><circle cx="224" cy="184" r="5.5" fill="{CABELO}"/>
<circle cx="178" cy="182" r="1.6" fill="{BRANCO}"/><circle cx="226" cy="182" r="1.6" fill="{BRANCO}"/></g>"""
    boca = f'<path d="M181 238 H219" stroke="#7A3B2E" stroke-width="5.5" stroke-linecap="round"/>'
    if expr == "coberto":
        franja = f'<path d="M150 134 Q146 196 178 190 Q168 160 196 140Z" fill="{CABELO}"/><path d="M214 138 Q232 168 226 196 Q248 170 252 150Z" fill="{CABELO}"/>'
        mao = f"""<g><rect x="156" y="196" width="88" height="70" rx="26" fill="{PELE_CLARA}" stroke="{PELE_ESC}" stroke-width="2.5"/>
<rect x="160" y="170" width="17" height="44" rx="8.5" fill="{PELE_CLARA}" stroke="{PELE_ESC}" stroke-width="2.5"/>
<rect x="181" y="164" width="17" height="48" rx="8.5" fill="{PELE_CLARA}" stroke="{PELE_ESC}" stroke-width="2.5"/>
<rect x="202" y="164" width="17" height="48" rx="8.5" fill="{PELE_CLARA}" stroke="{PELE_ESC}" stroke-width="2.5"/>
<rect x="223" y="170" width="17" height="44" rx="8.5" fill="{PELE_CLARA}" stroke="{PELE_ESC}" stroke-width="2.5"/></g>"""
        return base + olhos + nariz + franja + mao
    return base + olhos + nariz + boca


def selo(tipo, x=48, y=48, r=26):
    cor = OK if tipo == "ok" else NAO
    if tipo == "ok":
        g = f'<path d="M-11 1 L-3 10 L12 -9" stroke="{BRANCO}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    else:
        g = f'<path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="{BRANCO}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    return f'<g transform="translate({x} {y})"><circle r="{r}" fill="{cor}" stroke="{BRANCO}" stroke-width="3"/>{g}</g>'


def painel(tipo, pid):
    """Um dos 3 quadros 400x440. tipo: ok | sorrindo | coberto."""
    expr = {"ok": "serio", "sorrindo": "sorrindo", "coberto": "coberto"}[tipo]
    cor = OK if tipo == "ok" else NAO
    return f"""<g>
  <rect width="400" height="440" rx="22" fill="url(#fundo{pid})"/>
  {camera(pid, brilho=(tipo == 'ok'))}
  {seta(52, 62) if tipo == 'ok' else ''}
  {corpo()}
  {cabeca(expr, (0, -3) if tipo != 'sorrindo' else (0, 0))}
  <rect x="2" y="2" width="396" height="436" rx="21" fill="none" stroke="{cor}" stroke-width="5"/>
  {selo('ok' if tipo == 'ok' else 'nao', 346, 52, 28)}
</g>"""


def paineis_svg(largura=1280):
    """Os 3 quadros lado a lado, sem texto (o texto vai em HTML na tela e no layout das peças)."""
    esc = 1.0
    w = 3 * 400 + 2 * 24
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} 440" role="img" aria-label="Certo: rosto de frente e sério olhando a câmera preta. Errado: sorrindo. Errado: mão ou cabelo na frente do rosto.">
{defs('p')}
<g transform="translate(0 0)">{painel('ok','p')}</g>
<g transform="translate(424 0)">{painel('sorrindo','p')}</g>
<g transform="translate(848 0)">{painel('coberto','p')}</g></svg>"""
