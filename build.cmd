@echo off
call build\scripts\prebuild
node --enable-source-maps build/scripts/run_build.js %*
