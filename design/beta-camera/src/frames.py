import pathlib, sys
from playwright.sync_api import sync_playwright
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
fps = 30
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 720})
    pg.goto(pathlib.Path('anim.html').resolve().as_uri() + '?t=0'); pg.wait_for_timeout(500)
    for i in range(4 * fps):
        pg.evaluate(f"setT({i / fps})")
        pg.screenshot(path=str(out / f"f{i:03d}.png"))
    b.close()
