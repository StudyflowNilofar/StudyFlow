@echo off
title StudyFlow Full-Stack Installer
echo ========================================================
echo         INSTALLING STUDYFLOW DEPENDENCIES
echo ========================================================
echo.
echo [1/2] Installing Frontend Packages...
call npm install
echo.
echo [2/2] Installing Backend Packages...
cd server
call npm install
cd ..
echo.
echo ========================================================
echo   ALL DEPENDENCIES INSTALLED SUCCESSFULLY!
echo   Double-click start-app.bat to run the project.
echo ========================================================
pause
