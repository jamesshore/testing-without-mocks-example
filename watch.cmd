@echo off
call build\scripts\prebuild
goto watchLoop
:restart
echo "Restarting ..."
:watchLoop
node build/scripts/watch.cjs %*
if %ERRORLEVEL% EQU 0 goto restart