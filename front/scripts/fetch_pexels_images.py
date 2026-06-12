"""Download Pexels video poster images for landing cards."""
from __future__ import annotations

import os
import re
import urllib.request

VIDEOS = {
    "bjj-mat": 7988985,
    "bjj-roll": 7988984,
    "bjj-grappling": 7988983,
    "bjj-competition": 7988982,
}

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "landing")


def fetch_og_image(video_id: int) -> str | None:
    url = f"https://www.pexels.com/video/{video_id}/"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8", "ignore")
    match = re.search(r'property="og:image" content="([^"]+)"', html)
    return match.group(1) if match else None


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, vid in VIDEOS.items():
        img_url = fetch_og_image(vid)
        if not img_url:
            print(f"{name}: no og:image")
            continue
        out = os.path.join(OUT_DIR, f"{name}.jpg")
        urllib.request.urlretrieve(img_url, out)
        print(f"{name}: {os.path.getsize(out)} bytes")


if __name__ == "__main__":
    main()
