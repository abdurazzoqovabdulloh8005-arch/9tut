@echo off
title GitHub ga Yuklash - 9tut
chcp 65001 >nul
setlocal enabledelayedexpansion

set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

echo ========================================================
echo       CCNA PRO LOYIHASINI GITHUBGA YUKLASH TIZIMI
echo ========================================================
echo.
cd /d "c:\Users\user\Desktop\quiz"

echo [1/4] Repozitoriy va commit tekshirilmoqda...
git config user.name "abdurazzoqovabdulloh8005-arch"
git config user.email "abdurazzoqovabdulloh8005@gmail.com"
git remote remove origin 2>nul
git remote add origin https://github.com/abdurazzoqovabdulloh8005-arch/9tut.git
git branch -M main

echo [2/4] Barcha fayllar saqlanmoqda...
git add index.html style.css app.js data.js README.md .gitignore images/ CCNA_Offline_Pro.html
git commit -m "CCNA 200-301 Full Quiz, 21 Labs, Admin Panel & Simulators" 2>nul

echo.
echo ========================================================
echo Qaysi usul bilan yuklashni xohlaysiz?
echo.
echo  [1] Oddiy usul (Brauzer orqali yoki avtomatik)
echo  [2] GitHub Personal Access Token (PAT) orqali
echo ========================================================
set /p choice="Tanlang (1 yoki 2, standart 1): "

if "%choice%"=="2" (
    echo.
    echo GitHub Tokenni kiriting (https://github.com/settings/tokens dan olingan):
    set /p token="Token: "
    if defined token (
        echo.
        echo GitHub ga Token orqali yuklanmoqda...
        git push -u https://!token!@github.com/abdurazzoqovabdulloh8005-arch/9tut.git main
    ) else (
        echo Token kiritilmadi!
    )
) else (
    echo.
    echo GitHub ga yuklanmoqda...
    git push -u origin main
)

echo.
echo ========================================================
echo              Jarayon yakunlandi!
echo ========================================================
pause
exit
