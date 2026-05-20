@echo off
echo Starting UrbanCart Development Environment...

cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
echo Building backend...
call npm run build
start "UrbanCart Backend" cmd /k "npm run dev"
cd ..

cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "UrbanCart Frontend" cmd /k "npm start"
cd ..

echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:4200
