import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
MAX_RESUMES: int = int(os.getenv("MAX_RESUMES", "50"))
MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
ALLOWED_ORIGINS: list = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
