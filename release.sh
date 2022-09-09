#!/usr/bin/env bash

CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
VERSION=$(jq -r '.version' ./package.json )

git add .
git commit -m "v${VERSION}"
git tag "v${VERSION}" -m "new version"
git checkout -b release
npm install
npm run publish
git push
git checkout ${CURRENT_BRANCH}
