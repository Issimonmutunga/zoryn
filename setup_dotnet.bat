@echo off
setlocal

echo ==========================================
echo Zoryn - ASP.NET Core Setup
echo ==========================================
echo.

REM Move to the directory containing this BAT file
cd /d "%~dp0"

REM Check .NET SDK
echo Checking .NET SDK...
dotnet --version
if errorlevel 1 (
    echo.
    echo ERROR: .NET SDK is not installed or not on PATH.
    pause
    exit /b 1
)

echo.
echo Creating ASP.NET Core API structure...
echo.

REM Create API directory
if not exist "api" mkdir "api"

cd api

REM Create solution
dotnet new sln -n Zoryn

REM Create ASP.NET Core Web API
dotnet new webapi -n Zoryn.Api --use-controllers

REM Add project to solution
dotnet sln Zoryn.sln add Zoryn.Api\Zoryn.Api.csproj

echo.
echo ==========================================
echo ASP.NET Core setup complete
echo ==========================================
echo.
echo Created:
echo.
echo api\
echo   Zoryn.sln
echo   Zoryn.Api\
echo.
echo Starting the API...
echo.

cd Zoryn.Api

dotnet run

pause