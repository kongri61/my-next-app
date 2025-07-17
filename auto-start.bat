@echo off
title Property Map Site Auto Start
cd /d "C:\Users\user\.cursor"
echo Starting Property Map Site...
echo Waiting for server to start...
start /min cmd /c "npm run dev"
timeout /t 20 /nobreak > nul
start http://localhost:3000
echo Server started! Opening browser...
pause 