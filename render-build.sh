#!/usr/bin/env bash

echo "Installing yt-dlp..."

curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp

chmod +x yt-dlp

echo "yt-dlp installed"

npm install