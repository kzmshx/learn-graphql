#!/usr/bin/env bash

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ totalUsers, totalPhotos }" }' \
  http://localhost:4000/graphql | jq
