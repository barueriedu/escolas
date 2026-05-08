del /f /q "G:\Meu Drive\escolas\escolas\.git\worktrees\New\refs\desktop.ini"
if exist "G:\Meu Drive\escolas\escolas\.git\worktrees\New\refs\desktop.ini" (
  echo still exists
) else (
  echo removed
)
