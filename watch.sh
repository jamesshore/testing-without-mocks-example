#!/bin/sh

. build/scripts/prebuild.sh
while node build/scripts/watch.cjs $*; do
	echo "Restarting..."
done
