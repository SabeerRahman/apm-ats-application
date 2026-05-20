import asyncio
import logging
import os
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.config.settings import MAX_RESUMES, UPLOAD_DIR
from app.models.schemas import AnalysisResponse, CandidateResult
from app.services.claude_service import evaluate_resume
from app.services.parser_service import parse_jd, parse_resume
from app.services.scoring_service import calculate_keyword_score

router = APIRouter()
logger = logging.getLogger(__name__)

_ALLOWED_JD_EXTS = {".pdf", ".docx", ".txt"}
_ALLOWED_RESUME_EXTS = {".pdf"}


@router.post("/parse-resumes", response_model=AnalysisResponse)
async def parse_resumes(
    jd_file: UploadFile = File(..., description="Job Description (PDF/DOCX/TXT)"),
    resumes: List[UploadFile] = File(..., description="Resume PDFs (up to 50)"),
):
    if len(resumes) > MAX_RESUMES:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_RESUMES} resumes allowed")

    jd_ext = os.path.splitext(jd_file.filename)[1].lower()
    if jd_ext not in _ALLOWED_JD_EXTS:
        raise HTTPException(status_code=400, detail="JD must be PDF, DOCX, or TXT")

    for r in resumes:
        if os.path.splitext(r.filename)[1].lower() not in _ALLOWED_RESUME_EXTS:
            raise HTTPException(status_code=400, detail=f"{r.filename}: only PDF resumes accepted")

    try:
        jd_text = await parse_jd(jd_file)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if not jd_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from Job Description")

    semaphore = asyncio.Semaphore(5)

    async def process_one(resume_file: UploadFile):
        async with semaphore:
            try:
                parsed = await parse_resume(resume_file)
                kw = calculate_keyword_score(jd_text, parsed["text"])
                ai = await evaluate_resume(jd_text, parsed["text"], kw)

                final_score = round(0.4 * kw["score"] + 0.6 * ai.get("ai_score", 50), 1)

                return CandidateResult(
                    candidate_name=ai.get("candidate_name") or "Unknown",
                    email=ai.get("email") or "N/A",
                    phone=ai.get("phone") or "N/A",
                    score=final_score,
                    matched_keywords=kw["matched"],
                    missing_keywords=kw["missing"],
                    file_name=parsed["file_name"],
                    original_file_name=parsed["original_name"],
                )
            except Exception as exc:
                logger.error("Failed to process %s: %s", resume_file.filename, exc)
                return None

    results = await asyncio.gather(*[process_one(r) for r in resumes])

    above_80, between_50_79, below_50 = [], [], []
    total_failed = 0

    for r in results:
        if r is None:
            total_failed += 1
            continue
        if r.score >= 80:
            above_80.append(r)
        elif r.score >= 50:
            between_50_79.append(r)
        else:
            below_50.append(r)

    for lst in (above_80, between_50_79, below_50):
        lst.sort(key=lambda x: x.score, reverse=True)

    return AnalysisResponse(
        above_80=above_80,
        between_50_79=between_50_79,
        below_50=below_50,
        total_processed=len(results) - total_failed,
        total_failed=total_failed,
    )


@router.get("/download/{file_name}")
async def download_resume(file_name: str):
    if ".." in file_name or "/" in file_name or "\\" in file_name:
        raise HTTPException(status_code=400, detail="Invalid file name")

    file_path = os.path.join(UPLOAD_DIR, file_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_name,
        headers={"Content-Disposition": f'attachment; filename="{file_name}"'},
    )


@router.get("/health")
async def health():
    return {"status": "healthy", "message": "ATS Resume Parser API is running"}
