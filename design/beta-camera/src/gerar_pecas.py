import pathlib, sys
from playwright.sync_api import sync_playwright
import subprocess
import pecas
AQUI = pathlib.Path(__file__).resolve().parent.parent
saida = {"banner": ("aviso-banner-1600x500", pecas.banner()), "quadrado": ("aviso-quadrado-1080x1080", pecas.quadrado()), "vertical": ("aviso-vertical-1080x1920", pecas.vertical())}
with sync_playwright() as p:
    b = p.chromium.launch()
    for k, (nome, (html, w, h)) in saida.items():
        f = AQUI / "src" / f"_{k}.html"; f.write_text(html)
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        pg.goto(f.as_uri(), wait_until="load"); pg.wait_for_timeout(600)
        tmp = AQUI / f"_{k}@2x.png"; pg.screenshot(path=str(tmp), clip={"x": 0, "y": 0, "width": w, "height": h})
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(tmp),'-vf',f'scale={w}:{h}:flags=lanczos',str(AQUI / f'{nome}.png')],check=True); tmp.unlink()
    html, pw, ph = pecas.cartaz_a3()
    f = AQUI / "src" / "_cartaz.html"; f.write_text(html)
    pg = b.new_page(); pg.goto(f.as_uri(), wait_until="load"); pg.wait_for_timeout(600)
    pg.pdf(path=str(AQUI / "aviso-cartaz-A3-com-sangria.pdf"), width=f"{pw}mm", height=f"{ph}mm", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
    b.close()
(AQUI / "aviso-banner-1600x500.svg").write_text(pecas.banner_svg())
(AQUI / "paineis.svg").write_text(__import__("partes").paineis_svg())
