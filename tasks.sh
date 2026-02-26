#!/bin/bash

# CLI for atlas-taskboard
# Usage: ./tasks.sh [command] [args]

API_URL="http://localhost:3000/api/tasks"

case "$1" in
  "list")
    curl -s "$API_URL" | jq -r '.[] | "\(.id) | \(.status) | \(.priority) | \(.title)"'
    ;;
  "add")
    if [ -z "$2" ]; then
      echo "Usage: ./tasks.sh add \"Task title\" [priority]"
      exit 1
    fi
    PRIORITY="${3:-medium}"
    curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{\"title\": \"$2\", \"priority\": \"$PRIORITY\", \"category\": \"general\"}" | jq .
    ;;
  "done")
    if [ -z "$2" ]; then
      echo "Usage: ./tasks.sh done <id>"
      exit 1
    fi
    curl -s -X PUT "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{\"id\": \"$2\", \"status\": \"done\"}" | jq .
    ;;
  "delete")
    if [ -z "$2" ]; then
      echo "Usage: ./tasks.sh delete <id>"
      exit 1
    fi
    curl -s -X DELETE "$API_URL?id=$2"
    ;;
  *)
    echo "Usage: ./tasks.sh [command]"
    echo ""
    echo "Commands:"
    echo "  list                 List all tasks"
    echo "  add \"title\" [prio]   Add new task (prio: high/medium/low)"
    echo "  done <id>            Mark task as done"
    echo "  delete <id>          Delete task"
    ;;
esac
