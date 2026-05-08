#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

worktree = Path("../../escolas/.git/worktrees/New")

files_to_remove = [
    worktree / "desktop.ini",
    worktree / "refs" / "desktop.ini",
    worktree / "logs" / "desktop.ini",
    Path("../../escolas/.git/refs/desktop.ini"),
]

for file_path in files_to_remove:
    try:
        if file_path.exists():
            file_path.unlink()
            print(f"Removed: {file_path}")
        else:
            print(f"Not found: {file_path}")
    except Exception as e:
        print(f"Error removing {file_path}: {e}")

print("Cleanup complete")
