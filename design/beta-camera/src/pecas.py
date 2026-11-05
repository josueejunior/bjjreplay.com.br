"""Peças do aviso 'olhe para a câmera preta'. Digital (banner, quadrado, vertical) e impresso (cartaz A3)
são layouts DIFERENTES, não a mesma arte exportada (PADRAO-MATERIAL.md §2). As imagens são as fotos de fotos.py;
os HTML ficam em src/ e apontam para src/_fotos/."""
import base64
import fotos as F

T2 = "2 segundos, rosto sério."
T3 = "Sem sorrir. Sem mão, cabelo ou boné na frente do rosto."
VE = "Assim a câmera preta vê você:"
LOGO = "data:image/png;base64," + base64.b64encode((F.AQUI.parent.parent / "front/public/logo.png").read_bytes()).decode()

CSS = f"""
*{{box-sizing:border-box;margin:0}}
body{{background:{F.PRETO};color:{F.BRANCO};font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}}
h1{{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:800;text-transform:uppercase;line-height:.92;letter-spacing:.005em}}
.fundo{{position:absolute;inset:0;background:radial-gradient(120% 90% at 85% 0%,#12306A 0%,{F.PRETO} 62%)}}
.cap{{font-weight:600;color:#D5DCEB;text-align:center}} .t2{{font-weight:700}} .t3{{color:#D5DCEB}} .ve{{color:#AEB8CC;font-weight:500}}
.pn{{position:relative}} .pn img{{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}}
"""

SELO = {"certo": (F.OK, '<path d="M-20 3 L-6 18 L22 -16" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
        "sorrindo": (F.NAO, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#fff" stroke-width="10" stroke-linecap="round"/>')}
SELO["coberto"] = SELO["sorrindo"]


def painel(nome, largura, cap, unid="px"):
    """Foto 4:5 com borda verde (certo) ou vermelha (errado) e o selo ✓/✗ no canto; legenda embaixo."""
    cor, marca = SELO[nome]
    leg = dict((n, l) for n, l, _ in F.PAINEIS)[nome]
    alt = dict((n, a) for n, _, a in F.PAINEIS)[nome]
    b, r, s = largura * .016, largura * .045, largura * .19   # borda, raio, selo
    return (f'<div style="width:{largura}{unid}"><div class="pn" style="border:{b:.2f}{unid} solid {cor};border-radius:{r:.2f}{unid};overflow:hidden">'
            f'<img src="_fotos/{nome}.jpg" alt="{alt}">'
            f'<svg viewBox="-50 -50 100 100" style="position:absolute;right:{s*.22:.2f}{unid};top:{s*.22:.2f}{unid};width:{s:.2f}{unid};height:{s:.2f}{unid}">'
            f'<circle r="46" fill="{cor}" stroke="#fff" stroke-width="5"/>{marca}</svg></div>'
            f'<div class="cap" style="font-size:{cap}{unid};margin-top:{cap*.4:.2f}{unid}">{leg}</div></div>')


def pagina(corpo, w, h, extra_css=""):
    return f'<!doctype html><meta charset="utf-8"><style>{CSS}html,body{{width:{w}px;height:{h}px;overflow:hidden}}{extra_css}</style><body><div class="fundo"></div>{corpo}</body>'


def titulo(px, quebra=True):
    br = "<br>" if quebra else " "
    return f'<h1 style="font-size:{px}px">Antes de lutar,<br>olhe para a{br}<span style="color:{F.VERM}">câmera preta.</span></h1>'


def banner():
    w, h = 1600, 500
    cols = "".join(painel(n, 236, 21) for n, _, _ in F.PAINEIS)
    corpo = f"""<div style="position:absolute;left:64px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:18px">
{titulo(92)}<div class="t2" style="font-size:32px">{T2}</div><div class="t3" style="font-size:22px;max-width:600px;line-height:1.35;text-wrap:balance">{T3}</div></div>
<div style="position:absolute;right:56px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:14px">
<div class="ve" style="font-size:20px">{VE}</div><div style="display:flex;gap:22px">{cols}</div></div>"""
    return pagina(corpo, w, h), w, h


def quadrado():
    w = h = 1080
    cols = "".join(painel(n, 300, 26) for n, _, _ in F.PAINEIS)
    corpo = f"""<div style="position:absolute;left:48px;right:48px;top:52px">{titulo(104)}</div>
<div style="position:absolute;left:48px;right:48px;top:372px"><div class="ve" style="font-size:26px;margin-bottom:14px">{VE}</div>
<div style="display:flex;gap:24px;justify-content:space-between">{cols}</div></div>
<div style="position:absolute;left:48px;right:48px;bottom:48px;display:flex;justify-content:space-between;align-items:flex-end">
<div><div class="t2" style="font-size:42px">{T2}</div><div class="t3" style="font-size:28px;margin-top:8px;max-width:640px;line-height:1.3">{T3}</div></div>
<img src="{LOGO}" style="height:120px;margin-bottom:-16px"></div>"""
    return pagina(corpo, w, h), w, h


def vertical():
    """Stories 1080x1920: a foto da cena (atleta, tatame, câmera preta) abre a peça; texto entre y 190 e 1720."""
    w, h = 1080, 1920
    corpo = f"""<div style="position:absolute;left:0;right:0;top:0;height:900px;background:url(_fotos/cena.jpg) 58% 40%/auto 100% no-repeat"></div>
<div style="position:absolute;left:0;right:0;top:520px;height:380px;background:linear-gradient(180deg,rgba(10,10,12,0),{F.PRETO})"></div>
<div style="position:absolute;inset:0;padding:0 64px 200px;display:flex;flex-direction:column">
<div style="margin-top:700px">{titulo(118)}</div>
<div class="ve" style="font-size:28px;margin:40px 0 14px">{VE}</div>
<div style="display:flex;gap:24px;justify-content:space-between">{"".join(painel(n, 301, 26) for n, _, _ in F.PAINEIS)}</div>
<div style="margin-top:auto"><div class="t2" style="font-size:44px">{T2}</div><div class="t3" style="font-size:30px;margin-top:8px;line-height:1.3">{T3}</div></div></div>"""
    return pagina(corpo, w, h), w, h


def cartaz_a3():
    """Impresso: 297x420 mm + 3 mm de sangria por lado; página do PDF tem 10 mm de 'slug' com marcas de corte.
    Texto a >= 15 mm do corte. Cores em RGB; a gráfica converte para CMYK (fundo escuro = preto rico).
    Fotos a ~250 dpi no tamanho impresso (painel 84 mm = 1400 px de largura)."""
    SL, SG = 10, 3          # slug, sangria
    pw_mm, ph_mm = 297 + 2 * SG + 2 * SL, 420 + 2 * SG + 2 * SL
    marcas = "".join(
        f'<div style="position:absolute;background:#000;{c}"></div>' for c in [
            f"left:{SL-6}mm;top:{SL+SG}mm;width:5mm;height:.25mm", f"left:{SL+SG}mm;top:{SL-6}mm;width:.25mm;height:5mm",
            f"right:{SL-6}mm;top:{SL+SG}mm;width:5mm;height:.25mm", f"right:{SL+SG}mm;top:{SL-6}mm;width:.25mm;height:5mm",
            f"left:{SL-6}mm;bottom:{SL+SG}mm;width:5mm;height:.25mm", f"left:{SL+SG}mm;bottom:{SL-6}mm;width:.25mm;height:5mm",
            f"right:{SL-6}mm;bottom:{SL+SG}mm;width:5mm;height:.25mm", f"right:{SL+SG}mm;bottom:{SL-6}mm;width:.25mm;height:5mm"])
    css = f"""@page{{size:{pw_mm}mm {ph_mm}mm;margin:0}}html,body{{width:{pw_mm}mm;height:{ph_mm}mm;background:#fff}}
.arte{{position:absolute;left:{SL}mm;top:{SL}mm;width:{297+2*SG}mm;height:{420+2*SG}mm;overflow:hidden;background:{F.PRETO}}}
.in{{position:absolute;left:{SG+16}mm;right:{SG+16}mm;top:{SG+18}mm;bottom:{SG+16}mm}}"""
    cols = "".join(painel(n, 81, 6, "mm") for n, _, _ in F.PAINEIS)
    corpo = f"""<div class="arte">
<div style="position:absolute;left:0;right:0;top:0;height:172mm;background:url(_fotos/cena.jpg) 52% 30%/auto 100% no-repeat"></div>
<div style="position:absolute;left:0;right:0;top:104mm;height:70mm;background:linear-gradient(180deg,rgba(10,10,12,0),{F.PRETO})"></div>
<div class="in">
<h1 style="font-size:28mm;line-height:.9;margin-top:126mm">Antes de lutar,<br>olhe para a<br><span style="color:{F.VERM}">câmera preta.</span></h1>
<div class="ve" style="font-size:6mm;margin:8mm 0 3.5mm">{VE}</div>
<div style="display:flex;justify-content:space-between">{cols}</div>
<div style="position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:flex-end">
  <div><div class="t2" style="font-size:12mm">{T2}</div><div class="t3" style="font-size:7.5mm;margin-top:2.5mm;max-width:190mm;line-height:1.25">{T3}</div></div>
  <img src="{LOGO}" style="height:32mm;margin-bottom:-5mm"></div>
</div></div>{marcas}"""
    return (f'<!doctype html><meta charset="utf-8"><style>{CSS}{css}</style><body>{corpo}</body>', pw_mm, ph_mm)
