#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
YOZAVER_ENV_FILE="${YOZAVER_ENV_FILE:-.env.production}"
[[ -f "$YOZAVER_ENV_FILE" ]] || { echo "Copy .env.production.example to $YOZAVER_ENV_FILE and fill the values." >&2; exit 1; }
compose=(docker compose --env-file "$YOZAVER_ENV_FILE" -f compose.production.yml)
"${compose[@]}" config --quiet
"${compose[@]}" build api migrate
# Validate before touching the database or replacing the running API.
"${compose[@]}" run --rm --no-deps api node --input-type=module -e 'import {loadRuntimeConfig} from "./dist/config/runtime-config.js"; loadRuntimeConfig(); console.log("Production configuration valid.");'
"${compose[@]}" up -d --wait --wait-timeout 120 db
"${compose[@]}" run --rm migrate
"${compose[@]}" up -d --no-deps --wait --wait-timeout 120 api
"${compose[@]}" ps
echo "Yozaver API ready. Check https://api.yozaver.uz/health/ready after configuring Nginx and TLS."
