@echo off
rem Atalho para Windows: roda o start.sh pelo Git Bash.
rem Duplo clique, ou no terminal: start.cmd [--host] [--sync] [--preview] [--help]
chcp 65001 >nul
setlocal

set "GITBASH=%ProgramFiles%\Git\bin\bash.exe"
if not exist "%GITBASH%" set "GITBASH=%LocalAppData%\Programs\Git\bin\bash.exe"
if not exist "%GITBASH%" goto :sem_git

"%GITBASH%" "%~dp0start.sh" %*
if errorlevel 1 pause
exit /b

:sem_git
echo erro: Git Bash não encontrado. Instale o Git for Windows: https://git-scm.com/download/win
pause
exit /b 1
