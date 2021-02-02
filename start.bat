@echo off
echo Installing backend packages...
call npm install
echo Installing frontend packages...
cd angular-src
call npm install
cd ..
start /min npm start
cd angular-src
start /min npm start
cls
echo Opening application in 30 seconds
echo We opened two terminals for you to view backend and frontend service logs, check them out
TIMEOUT /T 30 /NOBREAK
start "" http://localhost:4200