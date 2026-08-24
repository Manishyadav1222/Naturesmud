#!/bin/bash
# ── Nature's Mud Automated Database Backup Script ─────────────────
# 
# Usage: ./backup.sh
# Put this in a daily cronjob (e.g. 0 2 * * * /var/www/natures-mud/deploy/backup.sh)

# Go to the script directory and then the project root
cd "$(dirname "$0")/.." || exit

# Load environment variables if needed
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Settings
BACKUP_DIR="./deploy/backups"
DB_CONTAINER="naturesmud_mysql"
DB_USER=${DB_USERNAME:-naturesmud}
DB_PASS=${DB_PASSWORD:-secret}
DB_NAME=${DB_DATABASE:-natures_mud}
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/db_backup_$DATE.sql.gz"
RETENTION_DAYS=7

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of database '$DB_NAME' from container '$DB_CONTAINER'..."

# Execute mysqldump inside the container and compress it directly
docker exec "$DB_CONTAINER" /usr/bin/mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$FILENAME"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup successfully saved to $FILENAME"
else
  echo "[$(date)] Error: Backup failed!"
  exit 1
fi

# Rotate old backups
echo "[$(date)] Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -exec rm -f {} \;

echo "[$(date)] Backup process complete."
