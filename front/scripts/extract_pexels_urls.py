"""Extract Pexels video file URLs from page JSON."""
from __future__ import annotations

import json
import re
import urllib.request

PAGES = [
    ("men-bjj", "https://www.pexels.com/video/men-practicing-brazilian-jiu-jitsu-7988984/"),
    ("kids-bjj", "https://www.pexels.com/video/children-doing-jiu-jitsu-7988985/"),
    ("search", "https://www.pexels.com/search/videos/jiu-jitsu/"),
]


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read().decode("utf-8", "ignore")


def extract_video_urls(html: str) -> list[str]:
    urls = set(re.findall(r"https://videos\.pexels\.com/video-files/\d+/[^\"'\\s<>]+", html))
    next_data = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', html)
    if next_data:
        try:
            payload = json.loads(next_data.group(1))
            blob = json.dumps(payload)
            urls.update(re.findall(r"https://videos\.pexels\.com/video-files/\d+/[^\"'\\s<>]+", blob))
        except json.JSONDecodeError:
            pass
    return sorted(urls)


if __name__ == "__main__":
    for label, page in PAGES:
        print(f"\n=== {label} ===")
        try:
            html = fetch(page)
            urls = extract_video_urls(html)
            print(f"status html len={len(html)} urls={len(urls)}")
            for u in urls[:12]:
                print(u)
        except Exception as exc:  # noqa: BLE001
            print(f"ERR {exc}")
