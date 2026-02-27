#!/bin/sh
set -e

echo "Syncing database schema..."
node ./node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma 2>&1 || echo "Warning: prisma db push failed, continuing..."

echo "Starting Next.js server..."
exec node server.js
