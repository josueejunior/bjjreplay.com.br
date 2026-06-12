"""Baixa fotos BJJ do Pixabay (CDN) para public/images/landing."""
from __future__ import annotations

import os
import urllib.request

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "landing")

# Fonte: https://pixabay.com/images/search/jiu-jitsu/ (licença Pixabay)
PIXABAY_BJJ = [
    ("px-signup.jpg", "https://cdn.pixabay.com/photo/2017/02/09/16/48/brazilian-jiu-jitsu-2052829_1280.jpg"),
    ("px-roll.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/35/bjj-8111390_1280.jpg"),
    ("px-grappling.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/35/bjj-8111393_1280.jpg"),
    ("px-guard.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/35/bjj-8111388_1280.jpg"),
    ("px-competition.jpg", "https://cdn.pixabay.com/photo/2017/02/09/16/43/brazilian-jiu-jitsu-2052806_1280.jpg"),
    ("px-kimono.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/35/bjj-8111391_1280.jpg"),
    ("px-training.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/35/bjj-8111387_1280.jpg"),
    ("px-fight.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/36/bjj-8111394_1280.jpg"),
    ("px-mat.jpg", "https://cdn.pixabay.com/photo/2017/03/29/09/25/jiu-jitsu-2184597_1280.jpg"),
    ("px-kids.jpg", "https://cdn.pixabay.com/photo/2017/11/17/10/38/brazilian-jiu-jitsu-2957075_1280.jpg"),
    ("px-submission.jpg", "https://cdn.pixabay.com/photo/2020/10/09/17/38/jiu-jitsu-5641080_1280.jpg"),
    ("px-sparring.jpg", "https://cdn.pixabay.com/photo/2023/07/26/16/59/bjj-8151666_1280.jpg"),
    ("px-tatame.jpg", "https://cdn.pixabay.com/photo/2023/07/06/21/35/jiu-jitsu-8111389_1280.jpg"),
    ("px-belt.jpg", "https://cdn.pixabay.com/photo/2016/09/21/23/38/jiu-jitsu-1686033_1280.png"),
]


def download(name: str, url: str) -> None:
    candidates = [url]
    if "_1280." in url:
        candidates.append(url.replace("_1280.", "_640."))

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, name)

    for candidate in candidates:
        req = urllib.request.Request(candidate, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            if len(data) > 10_000:
                with open(out, "wb") as fh:
                    fh.write(data)
                print(f"{name}: {len(data)} bytes")
                return
        except Exception as exc:  # noqa: BLE001
            print(f"{name}: fail {candidate} ({exc})")

    print(f"{name}: SKIPPED")


def main() -> None:
    for name, url in PIXABAY_BJJ:
        download(name, url)


if __name__ == "__main__":
    main()
