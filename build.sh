#!/bin/sh

. build/scripts/prebuild.sh
node --enable-source-maps build/scripts/run_build.js $*
