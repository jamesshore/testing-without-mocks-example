#!/bin/sh

. build/scripts/prebuild.sh
node build/scripts/integrate.js "$@"
