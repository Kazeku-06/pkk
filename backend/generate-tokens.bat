@echo off
echo Generating secure tokens...
cd /d "%~dp0"
python generate_tokens.py
pause