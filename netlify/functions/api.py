import sys
import os

# Add the project root to sys.path so we can import backend.main
# The file structure is:
# /netlify/functions/api.py
# /backend/main.py
# So we need to go up two steps to reach the root
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.append(root_path)

try:
    from backend.main import app
    from mangum import Mangum
except ImportError as e:
    # Fallback or debug information if imports fail
    print(f"Import Error: {e}")
    print(f"Current Path: {sys.path}")
    print(f"Current Directory: {os.getcwd()}")
    print(f"Directory Contents: {os.listdir(root_path)}")
    raise e

handler = Mangum(app)
