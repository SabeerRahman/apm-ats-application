import re
from typing import List

_STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "with", "by", "from", "is", "are", "was", "were", "be", "been", "have",
    "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "this", "that", "these", "those", "we", "our", "you",
    "your", "he", "she", "it", "they", "their", "us", "all", "any", "as",
    "if", "so", "up", "out", "no", "not", "than", "then", "when", "where",
    "who", "which", "what", "how", "its", "can", "also", "more", "other",
    "work", "years", "including", "such", "while", "through", "across",
    "into", "about", "over", "after", "within", "between", "each", "both",
    "i", "me", "my", "am", "per", "etc", "eg", "ie", "role", "will", "must",
    "able", "good", "well", "use", "used", "using", "team", "new", "key",
}


def _extract_keywords(text: str) -> set:
    text = text.lower()
    words = re.findall(r"\b[a-z][a-z+#.\-]{1,}\b", text)
    return {w for w in words if w not in _STOP_WORDS and len(w) > 2}


def calculate_keyword_score(jd_text: str, resume_text: str) -> dict:
    jd_keywords = _extract_keywords(jd_text)
    resume_keywords = _extract_keywords(resume_text)

    if not jd_keywords:
        return {"score": 0.0, "matched": [], "missing": []}

    matched = jd_keywords & resume_keywords
    missing = jd_keywords - resume_keywords

    score = (len(matched) / len(jd_keywords)) * 100

    return {
        "score": round(score, 2),
        "matched": sorted(matched)[:25],
        "missing": sorted(missing)[:25],
    }
