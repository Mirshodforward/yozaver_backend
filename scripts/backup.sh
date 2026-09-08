#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
cd "$(dirname "${BASH_SOURCE[0]}")/.."
YOZAVER_ENV_FILE="${YOZAVER_ENV_FILE:-.env.production}"
YOZAVER_BACKUP_DIR="${YOZAVER_BACKUP_DIR:-backups}"
mkdir -p "$YOZAVER_BACKUP_DIR"
backup="$YOZAVER_BACKUP_DIR/yozaver-$(date -u +%Y%m%dT%H%M%SZ).dump"
partial="$(mktemp "$YOZAVER_BACKUP_DIR/.yozaver-backup.XXXXXX")"
trap 'rm -f "$partial"' EXIT
docker compose --env-file "$YOZAVER_ENV_FILE" -f compose.production.yml exec -T db pg_dump -U typerush -d typerush -Fc > "$partial"
test -s "$partial"
mv "$partial" "$backup"
echo "Backup saved: $backup"
