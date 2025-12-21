@echo off
cd /d "%~dp0"
title TechArt Chronicle - Auto Update
color 0f

echo.
echo  ==============================================
echo      TechArt Chronicle - Content Updater
echo  ==============================================
echo.
echo  [1/2] Scanning for new Articles, Videos, and Tools...
echo  [2/2] Regenerating Homepage Timeline...
echo.

call npm run build

echo.
echo  ==============================================
echo      All Done! Homepage is now up to date.
echo  ==============================================
echo.
pause
