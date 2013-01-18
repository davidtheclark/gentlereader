#!/bin/bash

BR_AUTH="include=br-author-main out=../br-author-main-built.js"
BR_TAG="include=br-tag-main out=../br-tag-main-built.js"
BR_QUOT="include=br-quot-main out=../br-quot-main-built.js"
BR_SEL="include=br-sel-main out=../br-sel-main-built.js"
BR_TIME="include=br-timeline-main out=../br-timeline-main-built.js"
HOME="include=home-main out=../home-main-built.js"
JUST_QUOT="include=just-quot-main out=../just-quot-main-built.js"
RESOURCE="include=resource-main out=../resource-main-built.js"
SEL="include=selection-main out=../selection-main-built.js"
TAG="include=tag-main out=../tag-main-built.js"

node libraries/r.js -o ../configs/gen-config.js $BR_AUTH
node libraries/r.js -o ../configs/gen-config.js $BR_TAG
node libraries/r.js -o ../configs/gen-config.js $BR_QUOT
node libraries/r.js -o ../configs/gen-config.js $BR_SEL
node libraries/r.js -o ../configs/gen-config.js $BR_TIME
node libraries/r.js -o ../configs/gen-config.js $HOME
node libraries/r.js -o ../configs/gen-config.js $JUST_QUOT
node libraries/r.js -o ../configs/gen-config.js $RESOURCE
node libraries/r.js -o ../configs/gen-config.js $SEL
node libraries/r.js -o ../configs/gen-config.js $TAG