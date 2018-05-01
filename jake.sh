#!/bin/sh

[ ! -f node_modules/.bin/jake ] && npm rebuild
node_modules/.bin/jake -f build/scripts/build.jakefile.js $*
