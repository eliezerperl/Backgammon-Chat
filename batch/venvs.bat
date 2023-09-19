@echo off

:: Start CMD window for auth-server
start "auth-server" /D "C:\Users\eliez\OneDrive\Documents\Sela Projects\Final TalkBalk\server\auth-server" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

:: Start CMD window for contact_serv
start "contact_serv" /D "C:\Users\eliez\OneDrive\Documents\Sela Projects\Final TalkBalk\server\contact_serv" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

:: Start CMD window for chat_serv
start "chat_serv" /D "C:\Users\eliez\OneDrive\Documents\Sela Projects\Final TalkBalk\server\chat_serv" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

:: Start CMD window for game_serv
start "game_serv" /D "C:\Users\eliez\OneDrive\Documents\Sela Projects\Final TalkBalk\server\game_serv" cmd /k "python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && deactivate"

echo CMD windows started and virtual environments created with requirements installed in specified directories.

:: Pause (optional) - Remove if you don't want to pause the script
pause
