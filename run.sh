#!/bin/sh

. build/scripts/prebuild.sh
node --enable-source-maps generated/typescript/run.js "$@"