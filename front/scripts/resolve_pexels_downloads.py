"""Resolve Pexels jiu-jitsu videos via official download redirect."""
from __future__ import annotations

import urllib.error
import urllib.request

# cottonbro jiu-jitsu series + nearby IDs
CANDIDATES = list(range(7988968, 7988996))


def resolve_download_url(video_id: int) -> str | None:
    url = f"https://www.pexels.com/download/video/{video_id}/"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://www.pexels.com/",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            final = resp.geturl()
            if "videos.pexels.com" in final:
                return final
    except urllib.error.HTTPError:
        return None
    except Exception:
        return None
    return None


if __name__ == "__main__":
    found: list[tuple[int, str]] = []
    for vid in CANDIDATES:
        url = resolve_download_url(vid)
        if url:
            found.append((vid, url))
            print(f"{vid}|{url}")

    print(f"\nTOTAL={len(found)}")
