import json
import logging
import re

import anthropic

from app.config.settings import ANTHROPIC_API_KEY

logger = logging.getLogger(__name__)

_async_client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

_SYSTEM_PROMPT = (
    "You are an expert ATS (Applicant Tracking System) resume evaluator. "
    "Analyze resumes against job descriptions and respond with valid JSON only. "
    "No markdown formatting, no explanations—just the JSON object."
)


def _build_messages(jd_text: str, resume_text: str, keyword_data: dict) -> list:
    jd_snippet = jd_text[:3000]
    resume_snippet = resume_text[:3000]
    matched = ", ".join(keyword_data.get("matched", [])[:15])
    missing = ", ".join(keyword_data.get("missing", [])[:15])

    return [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"JOB DESCRIPTION:\n{jd_snippet}",
                    "cache_control": {"type": "ephemeral"},
                },
                {
                    "type": "text",
                    "text": (
                        f"RESUME:\n{resume_snippet}\n\n"
                        f"KEYWORD ANALYSIS:\n"
                        f"Matched: {matched}\n"
                        f"Missing: {missing}\n\n"
                        "Return ONLY this JSON (no markdown):\n"
                        '{"ai_score": <0-100>, "candidate_name": "<name or Unknown>", '
                        '"email": "<email or N/A>", "phone": "<phone or N/A>"}'
                    ),
                },
            ],
        }
    ]


def _parse_response(text: str) -> dict:
    try:
        match = re.search(r"\{[^{}]+\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return json.loads(text)
    except json.JSONDecodeError:
        logger.warning("Failed to parse Claude JSON response: %s", text[:200])
        return {"ai_score": 50, "candidate_name": "Unknown", "email": "N/A", "phone": "N/A"}


async def evaluate_resume(jd_text: str, resume_text: str, keyword_data: dict) -> dict:
    messages = _build_messages(jd_text, resume_text, keyword_data)

    response = await _async_client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=256,
        system=[
            {
                "type": "text",
                "text": _SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=messages,
    )

    return _parse_response(response.content[0].text)
