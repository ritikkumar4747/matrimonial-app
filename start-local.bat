@echo off
echo ========================================
echo MatrioMoney - Local Test Before Deploy
echo ========================================
echo.

echo [1/4] Checking backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
echo Backend dependencies OK
echo.

echo [2/4] Checking frontend...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
echo Frontend dependencies OK
echo.

echo [3/4] Starting backend server...
cd ..\backend
start "MatrioMoney Backend" cmd /k "npm start"
timeout /t 3 /nobreak >nul
echo.

echo [4/4] Starting frontend dev server...
cd ..\frontend
start "MatrioMoney Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo.

echo ========================================
echo LOCAL SERVERS RUNNING!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Test these features before deployment:
echo  - Register and login
echo  - Create profile
echo  - Send interest
echo  - Chat (after mutual interest)
echo  - Love Guru chatbot
echo  - Audio/Video call
echo.
echo Press any key to stop servers...
pause >nul

taskkill /FI "WindowTitle eq MatrioMoney Backend*" /T /F
taskkill /FI "WindowTitle eq MatrioMoney Frontend*" /T /F
echo Servers stopped.
