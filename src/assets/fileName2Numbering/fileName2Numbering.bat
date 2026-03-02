@echo off
setlocal enabledelayedexpansion

:: Get the name of the batch file (excluding path)
set "batchfile=%~nx0"

:: Initialize a counter
set count=1

:: Loop through all files in the current directory
for %%f in (*) do (
    :: Skip the batch file itself
    if /I "%%f" neq "%batchfile%" (
        :: Get file extension
        set ext=%%~xf

        :: Rename the file to the current number (with its original extension)
        ren "%%f" "!count!!ext!"

        :: Increment the counter
        set /a count+=1
    )
)

echo All files have been renamed.
pause
