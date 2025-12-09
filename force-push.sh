#!/bin/bash
set -e

# Build the project
npm install
npm run build

# Deploy using gh-pages
npm run deploy || {
    echo "Deploy failed, trying alternative method..."
    # Try using GitHub API to create a new deployment
    gh api -X POST /repos/albertomaydayjhondoe/Porteria/pages/builds \
        -H "Accept: application/vnd.github+json"
}
