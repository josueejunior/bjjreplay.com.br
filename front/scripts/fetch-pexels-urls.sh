#!/usr/bin/env bash
for id in 7988984 7988985 7988983 7988982 7988981 7988980; do
  url=$(curl -sL -A 'Mozilla/5.0' "https://www.pexels.com/video/${id}/" | grep -oE 'https://videos.pexels.com/video-files/[0-9]+/[^"<> ]+' | head -1)
  echo "${id}|${url}"
done
