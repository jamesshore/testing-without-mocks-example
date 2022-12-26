@echo off
call build\scripts\prebuild
goto watchLoop
:restart
echo "Restarting ..."
:watchLoop
node build/scripts/watch.js %*
if %ERRORLEVEL% EQU 0 goto restart