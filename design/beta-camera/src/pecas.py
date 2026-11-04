"""Peças do aviso 'olhe para a câmera preta'. Digital (banner, quadrado, vertical) e impresso (cartaz A3)
são layouts DIFERENTES, não a mesma arte exportada (PADRAO-MATERIAL.md §2)."""
import base64, pathlib
import partes as P

AQUI = pathlib.Path(__file__).resolve().parent.parent
T1 = "Antes de lutar, olhe para a câmera preta."
T2 = "2 segundos, rosto sério."
T3 = "Sem sorrir. Sem mão, cabelo ou boné na frente do rosto."
LOGO = "data:image/png;base64," + base64.b64encode((AQUI.parent.parent / "front/public/logo.png").read_bytes()).decode()

CSS = f"""
*{{box-sizing:border-box;margin:0}}
body{{background:{P.PRETO};color:{P.BRANCO};font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}}
h1{{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:800;text-transform:uppercase;line-height:.92;letter-spacing:.005em}}
.fundo{{position:absolute;inset:0;background:radial-gradient(120% 90% at 85% 0%,#12306A 0%,{P.PRETO} 62%)}}
.p{{display:block}} .cap{{font-weight:600;color:#D5DCEB}}
.t2{{font-weight:700}} .t3{{color:#D5DCEB}}
"""

def painel(tipo, pid, largura):
    h = largura * 440 / 400
    return (f'<svg class="p" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440" width="{largura}" height="{h:.0f}" role="img" '
            f'aria-label="{ {"ok":"Certo: rosto de frente e sério","sorrindo":"Errado: sorrindo","coberto":"Errado: mão ou cabelo na frente do rosto"}[tipo] }">'
            f'{P.defs(pid)}{P.painel(tipo, pid)}</svg>')

def pagina(corpo, w, h, extra_css=""):
    return f'<!doctype html><meta charset="utf-8"><style>{CSS}html,body{{width:{w}px;height:{h}px;overflow:hidden}}{extra_css}</style><body><div class="fundo"></div>{corpo}</body>'

def banner():
    w, h = 1600, 500
    pw = 270
    cols = "".join(f'<div style="text-align:center">{painel(t, "b"+t, pw)}<div class="cap" style="font-size:22px;margin-top:10px">{l}</div></div>'
                   for t, l in [("ok", "Certo"), ("sorrindo", "Sorrindo"), ("coberto", "Rosto coberto")])
    corpo = f"""<div style="position:absolute;left:64px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:18px">
<h1 style="font-size:92px">Antes de lutar,<br>olhe para a<br><span style="color:{P.VERM}">câmera preta.</span></h1>
<div class="t2" style="font-size:32px">{T2}</div><div class="t3" style="font-size:22px;max-width:600px;line-height:1.35;text-wrap:balance">{T3}</div></div>
<div style="position:absolute;right:56px;top:0;bottom:0;display:flex;gap:22px;align-items:center">{cols}</div>"""
    return pagina(corpo, w, h), w, h

def quadrado():
    w = h = 1080
    pw = 312
    cols = "".join(f'<div style="text-align:center">{painel(t, "q"+t, pw)}<div class="cap" style="font-size:26px;margin-top:12px">{l}</div></div>'
                   for t, l in [("ok", "Certo"), ("sorrindo", "Sorrindo"), ("coberto", "Rosto coberto")])
    corpo = f"""<div style="position:absolute;left:48px;right:48px;top:56px"><h1 style="font-size:136px">Antes de lutar,<br>olhe para a <span style="color:{P.VERM}">câmera preta.</span></h1></div>
<div style="position:absolute;left:48px;right:48px;top:480px;display:flex;gap:24px;justify-content:center">{cols}</div>
<div style="position:absolute;left:48px;right:48px;bottom:48px;display:flex;justify-content:space-between;align-items:flex-end">
<div><div class="t2" style="font-size:42px">{T2}</div><div class="t3" style="font-size:28px;margin-top:8px;max-width:640px;line-height:1.3">{T3}</div></div>
<img src="{LOGO}" style="height:120px;margin-bottom:-16px"></div>"""
    return pagina(corpo, w, h), w, h

def vertical():
    w, h = 1080, 1920
    corpo = f"""<div style="position:absolute;inset:0;padding:190px 64px 200px;display:flex;flex-direction:column;gap:26px">
<h1 style="font-size:124px">Antes de lutar,<br>olhe para a<br><span style="color:{P.VERM}">câmera preta.</span></h1>
<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
  <div style="text-align:center">{painel('ok','vo',430)}<div class="cap" style="font-size:28px;margin-top:8px">Certo</div></div>
  <div style="display:flex;gap:24px"><div style="text-align:center">{painel('sorrindo','vs',290)}<div class="cap" style="font-size:26px;margin-top:8px">Sorrindo</div></div>
  <div style="text-align:center">{painel('coberto','vc',290)}<div class="cap" style="font-size:26px;margin-top:8px">Rosto coberto</div></div></div></div>
<div style="margin-top:auto"><div class="t2" style="font-size:44px">{T2}</div><div class="t3" style="font-size:30px;margin-top:8px;line-height:1.3">{T3}</div></div></div>"""
    return pagina(corpo, w, h), w, h

def cartaz_a3():
    """Impresso: 297x420 mm + 3 mm de sangria por lado; página do PDF tem 10 mm de 'slug' com marcas de corte.
    Texto a >= 15 mm do corte. Cores em RGB; a gráfica converte para CMYK (fundo escuro = preto rico)."""
    SL, SG = 10, 3          # slug, sangria
    pw_mm, ph_mm = 297 + 2 * SG + 2 * SL, 420 + 2 * SG + 2 * SL
    def p(t, pid, wmm):
        return painel(t, pid, 1000).replace('width="1000"', f'width="{wmm}mm"').replace(f'height="{1000*440/400:.0f}"', f'height="{wmm*1.1}mm"')
    marcas = "".join(
        f'<div style="position:absolute;background:#000;{c}"></div>' for c in [
            f"left:{SL-6}mm;top:{SL+SG}mm;width:5mm;height:.25mm", f"left:{SL+SG}mm;top:{SL-6}mm;width:.25mm;height:5mm",
            f"right:{SL-6}mm;top:{SL+SG}mm;width:5mm;height:.25mm", f"right:{SL+SG}mm;top:{SL-6}mm;width:.25mm;height:5mm",
            f"left:{SL-6}mm;bottom:{SL+SG}mm;width:5mm;height:.25mm", f"left:{SL+SG}mm;bottom:{SL-6}mm;width:.25mm;height:5mm",
            f"right:{SL-6}mm;bottom:{SL+SG}mm;width:5mm;height:.25mm", f"right:{SL+SG}mm;bottom:{SL-6}mm;width:.25mm;height:5mm"])
    css = f"""@page{{size:{pw_mm}mm {ph_mm}mm;margin:0}}html,body{{width:{pw_mm}mm;height:{ph_mm}mm;background:#fff}}
.arte{{position:absolute;left:{SL}mm;top:{SL}mm;width:{297+2*SG}mm;height:{420+2*SG}mm;overflow:hidden;background:radial-gradient(120% 70% at 85% 0%,#12306A 0%,{P.PRETO} 62%)}}
.in{{position:absolute;left:{SG+16}mm;right:{SG+16}mm;top:{SG+18}mm;bottom:{SG+16}mm}}"""
    corpo = f"""<div class="arte"><div class="in">
<h1 style="font-size:36mm;line-height:.9">Antes de lutar,<br>olhe para a<br><span style="color:{P.VERM}">câmera preta.</span></h1>
<div style="display:flex;gap:7mm;margin-top:12mm;align-items:flex-start">
  <div>{p('ok','ao',152)}<div class="cap" style="font-size:7mm;margin-top:3mm">Certo</div></div>
  <div style="display:flex;flex-direction:column;gap:7mm">
    <div>{p('sorrindo','as',92)}<div class="cap" style="font-size:6mm;margin-top:2mm">Sorrindo</div></div>
    <div>{p('coberto','ac',92)}<div class="cap" style="font-size:6mm;margin-top:2mm">Rosto coberto</div></div></div></div>
<div style="position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:flex-end">
  <div><div class="t2" style="font-size:13mm">{T2}</div><div class="t3" style="font-size:8.5mm;margin-top:3mm;max-width:190mm;line-height:1.25">{T3}</div></div>
  <img src="{LOGO}" style="height:34mm;margin-bottom:-5mm"></div>
</div></div>{marcas}"""
    return (f'<!doctype html><meta charset="utf-8"><style>{CSS}{css}</style><body>{corpo}</body>', pw_mm, ph_mm)

def banner_svg():
    """Banner 1600x500 em SVG puro (fontes: Barlow Condensed e Inter; sem elas cai em Impact/Arial)."""
    inner = "".join(f'<g transform="translate({x} 90) scale(.68)">{P.painel(t, "s"+t)}</g>' for x, t in [(700, "ok"), (700+288, "sorrindo"), (700+576, "coberto")])
    caps = "".join(f'<text x="{x}" y="425" text-anchor="middle" font-family="Inter,Arial" font-weight="600" font-size="22" fill="#D5DCEB">{l}</text>'
                   for x, l in [(700+136, "Certo"), (700+288+136, "Sorrindo"), (700+576+136, "Rosto coberto")])
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500">
<defs><radialGradient id="bg" cx=".85" cy="0" r="1"><stop offset="0" stop-color="#12306A"/><stop offset=".62" stop-color="{P.PRETO}"/></radialGradient></defs>
<rect width="1600" height="500" fill="url(#bg)"/>{P.defs('s')}
<g font-family="'Barlow Condensed',Impact,sans-serif" font-weight="800" font-size="92" fill="{P.BRANCO}">
<text x="64" y="150">ANTES DE LUTAR,</text><text x="64" y="232">OLHE PARA A</text><text x="64" y="314" fill="{P.VERM}">CÂMERA PRETA.</text></g>
<text x="64" y="372" font-family="Inter,Arial" font-weight="700" font-size="32" fill="{P.BRANCO}">{T2}</text>
<text x="64" y="414" font-family="Inter,Arial" font-size="22" fill="#D5DCEB">Sem sorrir. Sem mão, cabelo ou boné</text><text x="64" y="442" font-family="Inter,Arial" font-size="22" fill="#D5DCEB">na frente do rosto.</text>
{inner}{caps}</svg>"""
