@echo off
call build\scripts\prebuild
node --enable-source-maps generated/typescript/run.js %*
