@echo off
call build\scripts\prebuild
node build/scripts/run_build.cjs clean
