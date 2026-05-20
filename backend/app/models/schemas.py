from pydantic import BaseModel
from typing import List


class CandidateResult(BaseModel):
    candidate_name: str
    email: str
    phone: str
    score: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    file_name: str
    original_file_name: str


class AnalysisResponse(BaseModel):
    above_80: List[CandidateResult]
    between_50_79: List[CandidateResult]
    below_50: List[CandidateResult]
    total_processed: int
    total_failed: int
