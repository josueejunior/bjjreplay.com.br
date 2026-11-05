"""Fotos do aviso 'olhe para a câmera preta' (Lucas 05/11 14:49: "vamos deixar outra mais realista").
Atleta GERADO, não é aluno real (rosto é dado biométrico; BRIEFING_FRONT_BETA.md). Gerado no Runway (gemini_image3.1_flash),
o mesmo atleta nas 4 fotos (certo/sorrindo/coberto partem da foto 'certo' como referência); os patches com letras
falsas do kimono e o logo da mesa ao fundo foram apagados (ffmpeg delogo). Originais em ../fotos/.
Cores da marca (BRIEFING_FRONT_BETA.md): azul-kimono, preto-faixa, vermelho-ponteira, branco."""
import pathlib, subprocess

AZUL, PRETO, VERM, BRANCO = "#0B3A7E", "#0A0A0C", "#B71E25", "#FEFEFD"
OK, NAO = "#2BB673", "#E03A3A"   # ✓ e ✗ precisam ler à distância; verde só aqui

AQUI = pathlib.Path(__file__).resolve().parent.parent
FOTOS = AQUI / "fotos"
PUBLIC = AQUI.parent.parent / "front/public/beta"

# Recorte 4:5 do rosto, igual nas três (fotos 2304x1856, mesmo enquadramento): x, y, w, h
ROSTO = (452, 40, 1400, 1750)
PAINEIS = [("certo", "Certo", "Certo: rosto de frente, sério, olhando a câmera"),
           ("sorrindo", "Sorrindo", "Errado: sorrindo"),
           ("coberto", "Rosto coberto", "Errado: boné, mão e toalha na frente do rosto")]


def ff(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, a)], check=True)


def preparar():
    """Gera os recortes usados pelas peças (src/_fotos/) e pelo site (front/public/beta/)."""
    tmp = AQUI / "src/_fotos"; tmp.mkdir(exist_ok=True)
    x, y, w, h = ROSTO
    for nome, _, _ in PAINEIS:
        ff("-i", FOTOS / f"{nome}.jpg", "-vf", f"crop={w}:{h}:{x}:{y}", "-q:v", "2", tmp / f"{nome}.jpg")       # peças e cartaz
        ff("-i", FOTOS / f"{nome}.jpg", "-vf", f"crop={w}:{h}:{x}:{y},scale=480:600:flags=lanczos", "-q:v", "4",
           PUBLIC / f"aviso-{nome}.jpg")                                                                      # site (≤ 240 px na tela, 2x)
    ff("-i", FOTOS / "cena.jpg", "-vf", "scale=1600:-2:flags=lanczos", "-q:v", "3", tmp / "cena.jpg")
    # Visão da câmera preta para a animação: 16:9 com o rosto no centro
    ff("-i", FOTOS / "certo.jpg", "-vf", "crop=2304:1296:0:168,scale=1600:900:flags=lanczos", "-q:v", "3", tmp / "pov.jpg")
    return tmp


if __name__ == "__main__":
    preparar()
