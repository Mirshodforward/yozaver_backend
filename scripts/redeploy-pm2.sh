#!/usr/bin/env bash
# Redeploy the API on the shared droplet (161.35.27.123).
#
# This box already runs several other production sites, PostgreSQL 14 and PM2,
# and has under 1 GB of RAM — so the API runs as a PM2 process against the
# system PostgreSQL rather than in Docker. See "Live deployment" in README.md.
set -euo pipefail

APP_DIR=/root/yozaver
cd "$APP_DIR"

echo "==> Pulling latest main"
git fetch --all --quiet
git reset --hard origin/main

echo "==> Installing dependencies"
npm ci --no-audit --no-fund

echo "==> Prisma client + migrations"
npx prisma generate
npx prisma migrate deploy

echo "==> Building"
npm run build

echo "==> Restarting PM2 process"
pm2 restart yozaver-api --update-env
pm2 save

sleep 4
echo "==> Health"
curl -fsS -m 10 http://127.0.0.1:4000/health/ready && echo
