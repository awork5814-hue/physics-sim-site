#!/bin/bash
cd "$(dirname "$0")"
source .env 2>/dev/null
pkill -f "node server.js" 2>/dev/null
sleep 1
nohup node server.js > server.log 2>&1 &
sleep 2
if pgrep -f "node server.js" > /dev/null; then
  echo "Server started successfully"
else
  echo "Failed to start server"
  cat server.log
fi
