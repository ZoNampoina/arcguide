#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
mkdir -p dist/assets
tsc -p tsconfig.json
cp public/index.html public/manifest.webmanifest public/icon.svg public/guides.json public/sw.js dist/
cp src/styles.css dist/assets/styles.css
printf 'Build OK — %s fiches\n' "$(python -c 'import json;print(len(json.load(open("public/guides.json"))))')"