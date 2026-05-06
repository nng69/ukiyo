@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "SOURCE_DIR=%SCRIPT_DIR%ODDIO"

if not exist "%SOURCE_DIR%\index.html" (
  echo Errore: cartella sorgente ODDIO non trovata accanto allo script.
  exit /b 1
)

set "DESKTOP_DIR=%USERPROFILE%\Desktop"
if exist "%USERPROFILE%\OneDrive\Desktop" set "DESKTOP_DIR=%USERPROFILE%\OneDrive\Desktop"
if exist "%USERPROFILE%\OneDrive\Scrivania" set "DESKTOP_DIR=%USERPROFILE%\OneDrive\Scrivania"
if exist "%USERPROFILE%\Scrivania" set "DESKTOP_DIR=%USERPROFILE%\Scrivania"

if not exist "%DESKTOP_DIR%" mkdir "%DESKTOP_DIR%"
if exist "%DESKTOP_DIR%\ODDIO" rmdir /s /q "%DESKTOP_DIR%\ODDIO"
xcopy "%SOURCE_DIR%" "%DESKTOP_DIR%\ODDIO" /E /I /Y >nul

echo ODDIO installato sul Desktop:
echo %DESKTOP_DIR%\ODDIO
echo.
echo Per avviare l'app apri %DESKTOP_DIR%\ODDIO\index.html nel browser.
endlocal
