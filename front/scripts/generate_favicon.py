"""Gera ícones da aba (BJJ branco no azul) e logo completa (Apple/PWA)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
APP = ROOT / "app"
LOGO = PUBLIC / "logo.png"

BLUE = (59, 130, 246)
RED = (239, 68, 68)
WHITE = (255, 255, 255)

FONT_CANDIDATES = (
    Path(r"C:\Windows\Fonts\arialbd.ttf"),
    Path(r"C:\Windows\Fonts\Arial Black.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
)


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def draw_tab_icon(size: int) -> Image.Image:
    """Fundo azul + BJJ branco grande — legível em 16px na aba do navegador."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = max(2, int(size * 0.22))

    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=BLUE)

    font_size = max(8, int(size * 0.38))
    font = load_font(font_size)
    draw.text((size / 2, size * 0.58), "BJJ", fill=WHITE, anchor="mm", font=font)

    dot_r = max(2, int(size * 0.09))
    dot_cx = size - dot_r - max(2, int(size * 0.08))
    dot_cy = dot_r + max(2, int(size * 0.06))
    draw.ellipse(
        (dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r),
        fill=RED,
    )

    return img


def prepare_full_mark(logo: Image.Image) -> Image.Image:
    rgba = logo.convert("RGBA")
    r, g, b, a = rgba.split()
    rgb = Image.merge("RGB", (r, g, b))
    enhanced = ImageEnhance.Color(rgb).enhance(1.12)
    enhanced = ImageEnhance.Contrast(enhanced).enhance(1.04)
    er, eg, eb = enhanced.split()
    return Image.merge("RGBA", (er, eg, eb, a))


def save_png(mark: Image.Image, size: int, path: Path) -> None:
    out = mark.resize((size, size), Image.Resampling.LANCZOS)
    out.save(path, optimize=True)


def save_ico(mark: Image.Image, path: Path) -> None:
    frames = [mark.resize((s, s), Image.Resampling.LANCZOS) for s in (16, 32, 48)]
    frames[1].save(
        path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=frames[2:],
    )


def main() -> None:
    tab = draw_tab_icon(256)
    full = prepare_full_mark(Image.open(LOGO))

    save_png(tab, 32, PUBLIC / "favicon-32.png")
    save_png(tab, 32, APP / "icon.png")
    save_ico(tab, PUBLIC / "favicon.ico")
    save_ico(tab, APP / "favicon.ico")

    save_png(full, 180, PUBLIC / "logo-icon-180.png")
    save_png(full, 512, PUBLIC / "logo-icon-512.png")
    save_png(full, 512, PUBLIC / "logo-icon.png")
    save_png(tab, 32, PUBLIC / "logo-icon-32.png")

    svg_src = PUBLIC / "favicon.svg"
    APP.joinpath("icon.svg").write_text(svg_src.read_text(encoding="utf-8"), encoding="utf-8")

    print("Ícones gerados:", PUBLIC, APP)


if __name__ == "__main__":
    main()
