import asyncio
import os
import uuid

import aiofiles
from fastapi import UploadFile

from app.config.settings import MAX_FILE_SIZE_MB, UPLOAD_DIR
from app.utils.file_utils import delete_file, ensure_upload_dir, extract_text

MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024


async def _save_upload(file: UploadFile) -> tuple[str, str]:
    ensure_upload_dir()
    ext = os.path.splitext(file.filename)[1].lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"File exceeds {MAX_FILE_SIZE_MB}MB limit")

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    return file_path, unique_name


async def parse_resume(file: UploadFile) -> dict:
    file_path, unique_name = await _save_upload(file)
    text = await asyncio.to_thread(extract_text, file_path)
    return {
        "original_name": file.filename,
        "file_name": unique_name,
        "file_path": file_path,
        "text": text,
    }


async def parse_jd(file: UploadFile) -> str:
    file_path, _ = await _save_upload(file)
    try:
        return await asyncio.to_thread(extract_text, file_path)
    finally:
        delete_file(file_path)
