"""Resolve working Pexels CDN URLs for jiu-jitsu videos."""
from __future__ import annotations

import urllib.error
import urllib.request

# Known jiu-jitsu clips from https://www.pexels.com/search/videos/jiu-jitsu/
CANDIDATE_IDS = [
    7988984,  # men practicing Brazilian jiu-jitsu
    7988985,  # children doing jiu-jitsu
    7988983,
    7988982,
    7988981,
    7988980,
    6770500,
    6770501,
    6770502,
    6770503,
    6770504,
    6770505,
]

SUFFIXES = [
    "hd_1920_1080_25fps.mp4",
    "hd_1280_720_25fps.mp4",
    "sd_640_360_25fps.mp4",
    "uhd_3840_2160_25fps.mp4",
    "hd_1920_1080_30fps.mp4",
    "hd_1280_720_30fps.mp4",
]


def probe(url: str) -> bool:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except urllib.error.HTTPError:
        return False
    except Exception:
        return False


def main() -> None:
    found: list[tuple[int, str]] = []
    for vid in CANDIDATE_IDS:
        for suffix in SUFFIXES:
            url = f"https://videos.pexels.com/video-files/{vid}/{vid}-{suffix}"
            if probe(url):
                found.append((vid, url))
                print(f"OK {vid} -> {url}")
                break
        else:
            print(f"MISS {vid}")

    print("\n--- UNIQUE ---")
    seen: set[int] = set()
    for vid, url in found:
        if vid not in seen:
            seen.add(vid)
            print(f"{vid}: {url}")


if __name__ == "__main__":
    main()
