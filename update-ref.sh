#!/bin/bash
set -e

# Get the local commit SHA
LOCAL_SHA=$(git rev-parse HEAD)
echo "Local commit: $LOCAL_SHA"

# Update the main branch reference to point to our commit
echo "Updating main branch reference..."
gh api -X PATCH /repos/albertomaydayjhondoe/Porteria/git/refs/heads/main \
  -f sha="$LOCAL_SHA" \
  -F force=true

echo "Branch updated successfully!"
