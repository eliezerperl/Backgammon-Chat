@echo off

set "rootDir=%~dp0"

start "Auth Service" cmd /k "cd /d %rootDir%server\auth-server && python main.py"
start "Contact Service" cmd /k "cd /d %rootDir%server\contact_serv && python main.py"
start "Chat Service" cmd /k "cd /d %rootDir%server\chat_serv && python main.py"
start "Game Service" cmd /k "cd /d %rootDir%server\game_serv && python main.py"

timeout /t 5

start "App" cmd /k "cd /d %rootDir%client\Eli-Talk && npm run dev"

pause