@echo off

set "rootDir=%~dp0"


start "auth-server" /B /D "%rootDir%server\auth-server" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

start "contact_serv" /B /D "%rootDir%server\contact_serv" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

start "chat_serv" /B /D "%rootDir%server\chat_serv" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

start "game_serv" /B /D "%rootDir%server\game_serv" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

echo CMD windows started and virtual environments created with requirements installed in specified directories.


pause
