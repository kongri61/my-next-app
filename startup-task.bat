@echo off
cd /d "C:\Users\user\.cursor"
pm2 start ecosystem.config.js
timeout /t 15 /nobreak > nul
start http://localhost:3000 