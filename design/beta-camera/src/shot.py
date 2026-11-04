import pathlib, sys
from playwright.sync_api import sync_playwright

def shot(html, out, w, h, dsf=1):
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=dsf)
        pg.goto(pathlib.Path(html).resolve().as_uri(), wait_until="load"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": w, "height": h}); b.close()

if __name__ == "__main__":
    shot(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]) if len(sys.argv) > 5 else 1)
