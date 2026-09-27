@echo off
title StudyFlow Full-Stack Launcher
echo ========================================================
echo        STARTING STUDYFLOW (Smart Study Management)
echo ========================================================
echo.
echo 1. Starting Backend API Server (Port 5000)...
echo 2. Starting Frontend Web App (Port 5173)...
echo.
echo Opening browser at http://localhost:5173
start http://localhost:5173
echo.
npm start
pause
