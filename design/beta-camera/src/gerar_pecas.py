"""Gera tudo do aviso a partir de ../fotos/: recortes do site, banner/quadrado/vertical (PNG), cartaz A3 (PDF) e a
animação (mp4/webm/gif + pôster), e copia o que o site usa para front/public/beta/. Rodar: python src/gerar_pecas.py"""
import shutil, tempfile, pathlib
from playwright.sync_api import sync_playwright
import fotos as F, pecas, anim

AQUI, SRC = F.AQUI, F.AQUI / "src"
F.preparar()
anim.gerar(SRC / "anim.html")
saida = {"banner": ("aviso-banner-1600x500", pecas.banner()), "quadrado": ("aviso-quadrado-1080x1080", pecas.quadrado()),
         "vertical": ("aviso-vertical-1080x1920", pecas.vertical())}
with sync_playwright() as p:
    b = p.chromium.launch()
    for k, (nome, (html, w, h)) in saida.items():
        f = SRC / f"_{k}.html"; f.write_text(html)
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        pg.goto(f.as_uri(), wait_until="networkidle"); pg.wait_for_timeout(600)
        tmp = AQUI / f"_{k}@2x.png"; pg.screenshot(path=str(tmp), clip={"x": 0, "y": 0, "width": w, "height": h})
        F.ff("-i", tmp, "-vf", f"scale={w}:{h}:flags=lanczos", AQUI / f"{nome}.png"); tmp.unlink()
    html, pw, ph = pecas.cartaz_a3()
    f = SRC / "_cartaz.html"; f.write_text(html)
    pg = b.new_page(); pg.goto(f.as_uri(), wait_until="networkidle"); pg.wait_for_timeout(600)
    pg.pdf(path=str(AQUI / "aviso-cartaz-A3-com-sangria.pdf"), width=f"{pw}mm", height=f"{ph}mm", print_background=True,
           margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})

    fps, quadros = 30, pathlib.Path(tempfile.mkdtemp())
    pg = b.new_page(viewport={"width": 1280, "height": 720})
    pg.goto((SRC / "anim.html").as_uri() + "?t=0", wait_until="networkidle"); pg.wait_for_timeout(500)
    for i in range(4 * fps):
        pg.evaluate(f"setT({i / fps})"); pg.screenshot(path=str(quadros / f"f{i:03d}.png"))
    pg.evaluate("setT(3.6)"); pg.screenshot(path=str(quadros / "poster.png"))
    b.close()

q = quadros / "f%03d.png"
F.ff("-framerate", 30, "-i", q, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", AQUI / "aviso-camera-preta.mp4")
F.ff("-framerate", 30, "-i", q, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "44", "-row-mt", "1", AQUI / "aviso-camera-preta.webm")
F.ff("-framerate", 30, "-i", q, "-vf", "fps=12,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4", AQUI / "aviso-camera-preta.gif")
F.ff("-i", quadros / "poster.png", "-q:v", "3", AQUI / "aviso-camera-preta-poster.jpg")
shutil.rmtree(quadros)
for n in ["aviso-camera-preta.mp4", "aviso-camera-preta.webm", "aviso-camera-preta-poster.jpg"]:
    shutil.copy(AQUI / n, F.PUBLIC / n)
