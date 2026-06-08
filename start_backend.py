import os
import subprocess
import sys

os.chdir(r"C:\Users\Admin\Desktop\FYP Dataset")
subprocess.run(
    [sys.executable, "-m", "uvicorn", "backend.app.main:app",
     "--host", "127.0.0.1", "--port", "8000", "--reload"]
)
