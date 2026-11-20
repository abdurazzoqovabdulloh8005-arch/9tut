@echo off
title GitHub ga Yuklash - 9tut
chcp 65001 >nul
setlocal enabledelayedexpansion

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

echo ========================================================
echo       CCNA PRO LOYIHASINI GITHUBGA YUKLASH TIZIMI
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Git sozlamalari tekshirilmoqda...
git config user.name "abdurazzoqovabdulloh8005-arch"
git config user.email "abdurazzoqovabdulloh8005@gmail.com"
git remote remove origin 2>nul
git remote add origin https://github.com/abdurazzoqovabdulloh8005-arch/9tut.git
git branch -M main

echo [2/3] O'zgarishlar saqlanmoqda...
git add -A
git commit -m "feat: update online trainer, cross-device sync & mobile chat" 2>nul

echo.
echo ========================================================
echo Qaysi usul bilan yuklashni xohlaysiz?
echo.
echo  [1] Oddiy usul (Brauzer / Avtomatik)
echo  [2] GitHub Personal Access Token (PAT) orqali
echo ========================================================
set /p choice="Tanlang (1 yoki 2, standart 1): "

if "%choice%"=="2" goto ask_token

echo.
echo [3/3] GitHub ga yuklanmoqda (Oddiy usul)...
git push -u origin main
if %errorlevel% equ 0 (
    goto success
)

echo.
echo ========================================================
echo [OGOHLANTIRISH] Oddiy usul bilan yuklash o'xshamadi!
echo Sababi: GitHub brauzer orqali ruxsat ololmadi.
echo Endi Token (PAT) orqali yuklashga o'tamiz.
echo ========================================================
echo.

:ask_token
echo GitHub Tokenni kiriting (https://github.com/settings/tokens dan olingan):
echo (Agar tokeningiz bo'lmasa, yuqoridagi ssilkaga kirib 'Generate new token (classic)' bosasiz va 'repo' ga galochka qo'yasiz)
set /p token="Token: "
if not defined token (
    echo Token kiritilmadi! Jarayon to'xtatildi.
    goto finish
)

echo.
echo [3/3] GitHub ga Token orqali yuklanmoqda...
git push -u https://!token!@github.com/abdurazzoqovabdulloh8005-arch/9tut.git main
if %errorlevel% equ 0 (
    goto success
) else (
    echo.
    echo [XATOLIK] Token noto'g'ri yoki ruxsati yo'q. Qaytadan tekshiring.
    goto finish
)

:success
echo.
echo ========================================================
echo  [MUVAFFAQIYAT] O'zgarishlar GitHub ga chiqdi!
echo  Vercel avtomatik yangilashni boshladi (10-20 soniya).
echo  Saytni brauzerda Ctrl + F5 bilan yangilab tekshiring!
echo ========================================================

:finish
echo.
pause
exit
