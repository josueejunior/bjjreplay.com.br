"""Resolve Pexels BJJ video CDN URLs for landing media."""
from __future__ import annotations

import re
import urllib.request

PEXELS_IDS = [
    7988984,  # men practicing BJJ
    7988985,  # children doing jiu jitsu
    7988983,
    7988982,
    7988981,
    7988980,
]

PATTERN = re.compile(r"https://videos\.pexels\.com/video-files/\d+/[^\"'\s<>]+")


def fetch_url(video_id: int) -> str | None:
    req = urllib.request.Request(
        f"https://www.pexels.com/video/{video_id}/",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        html = resp.read().decode("utf-8", "ignore")
    match = PATTERN.search(html)
    return match.group(0) if match else None


if __name__ == "__main__":
    for vid in PEXELS_IDS:
        try:
            url = fetch_url(vid)
            print(f"{vid}|{url or 'NONE'}")
        except Exception as exc:  # noqa: BLE001
            print(f"{vid}|ERR {exc}")
