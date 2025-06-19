import io
import os
import re
import json
import traceback

from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import PyPDF2


load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in environment")
client = OpenAI(api_key=API_KEY)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(raw_bytes: bytes) -> str:
    """
    Read a PDF of any length and return all its text.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(raw_bytes))
    return "\n".join(page.extract_text() or "" for page in reader.pages)

def grab_block(text: str, heading: str) -> str | None:
    """
    Return content under an all-caps heading up to the next all-caps heading.
    """
    pattern = rf"{heading}\s*(.*?)\n(?=[A-Z ]{{3,}}:|$)"
    m = re.search(pattern, text, re.S)
    return m.group(1).strip() if m else None

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str    = Form(...)
):
    try:
        
        raw  = await file.read()
        full = extract_text(raw)
        U    = full.upper()

        
        parts = [
            f"Job Position Name: {job_role or 'null'}",
            f"Career Objective: {grab_block(U, 'CAREER OBJECTIVE') or grab_block(U, 'OBJECTIVE') or 'null'}",
            f"Skills: {grab_block(U, 'SKILLS') or grab_block(U, 'TECHNICAL SKILLS') or 'null'}",
            f"Experience: {grab_block(U, 'EXPERIENCE') or grab_block(U, 'PROFESSIONAL EXPERIENCE') or 'null'}",
           
        ]
        prompt = "\n".join(parts)

        
        system_msg = (
            "You are a senior HR recruiter. Given the candidate's resume fields "
            "and desired Job Position Name, return *only* a JSON object with:\n"
            "  • score: a number from 0 to 100 (0=poor, 100=excellent)\n"
            "  • category: one of [Excellent, Good, Fair, Poor]\n"
            "Penalize vague language, missing role alignment, or lack of metrics."
        )
        user_msg = f"Resume Data:\n```\n{prompt}\n```"

        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0,
            max_tokens=60,
        )

        content = resp.choices[0].message.content.strip()
       
        result = json.loads(content)
        return {
            "score":     result["score"],
            "category":  result["category"],
            "prompt":    prompt
        }

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to analyze resume")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)