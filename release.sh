#!/usr/bin/env bash

CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
VERSION=$(jq -r '.version' ./package.json )
# test code
npm run build
npm run lint
# push to current branch
git add .
git commit -m "v${VERSION}"
git tag "v${VERSION}" -m "new version"
git push
# create branch release and publish from branch
git checkout -b release
npm install
npm run publish
git push --set-upstream origin release
git checkout ${CURRENT_BRANCH}
# remove branch release local and remote
git branch -d release
git push origin --delete release