@echo off
cd /d "C:\Users\user\.cursor"
start /min cmd /c "npm run dev"
timeout /t 10 /nobreak > nul
start http://localhost:3000 