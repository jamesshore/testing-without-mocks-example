@echo off
call build\scripts\prebuild
node src/run.js %*
