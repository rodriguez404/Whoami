#!/bin/sh
set -e

PRISMA=./node_modules/.bin/prisma

echo "[entrypoint] applying migrations"
"$PRISMA" migrate deploy

echo "[entrypoint] seeding"
"$PRISMA" db seed

# exec: node становится PID 1 и получает SIGTERM напрямую.
exec "$@"
