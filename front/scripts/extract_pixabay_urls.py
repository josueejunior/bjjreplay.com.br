import re
from pathlib import Path

files = [
    Path(__file__).parent / "_pixabay-p2.html",
    Path(r"C:\Users\user\.cursor\projects\g-STRAVA\agent-tools\90a198fe-3c06-449d-a7fe-351e5558601f.txt"),
]
seen = set()
for path in files:
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    for url in re.findall(r"https://cdn\.pixabay\.com/photo/[^\s\"'<>]+", text):
        if "jiu-fen" in url:
            continue
        if "bjj" in url.lower() or "jiu-jitsu" in url.lower() or "jiu_jitsu" in url.lower():
            base = re.sub(r"_\d+\.jpg$", "_1280.jpg", url)
            seen.add(base)

for url in sorted(seen):
    print(url)
