# import io
# import os
# import re
# import torch
# import PyPDF2

# from fastapi import FastAPI, File, UploadFile, Form
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv
# from transformers import AutoTokenizer, DistilBertForSequenceClassification

# # ─── load env & model ────────────────────────────────
# load_dotenv()
# HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
# if not HF_TOKEN:
#     raise RuntimeError("Missing HUGGINGFACE_TOKEN")
# HF_REPO = "AkCode100/distilbert-resume-regression"

# tokenizer = AutoTokenizer.from_pretrained(HF_REPO, use_auth_token=HF_TOKEN)
# model     = DistilBertForSequenceClassification.from_pretrained(
#                 HF_REPO, use_auth_token=HF_TOKEN, num_labels=1
#             )
# model.eval()

# # ─── fastapi + CORS ───────────────────────────────────
# app = FastAPI()
# app.add_middleware(
#   CORSMiddleware,
#   allow_origins=["http://localhost:3000"],
#   allow_credentials=True,
#   allow_methods=["*"],
#   allow_headers=["*"],
# )

# def extract_text(raw_bytes: bytes) -> str:
#     pdf_stream = io.BytesIO(raw_bytes)
#     reader     = PyPDF2.PdfReader(pdf_stream)
#     return "\n".join(page.extract_text() or "" for page in reader.pages)

# def grab_block(text: str, heading: str) -> str | None:
#     """Return content under an all-caps heading up to the next all-caps heading."""
#     pattern = rf"{heading}\s*(.*?)\n([A-Z ]{{3,}}:|$)"
#     m = re.search(pattern, text, re.S)
#     return m.group(1).strip() if m else None

# @app.post("/analyze-resume")
# async def analyze_resume(
#     file: UploadFile = File(...),
#     job_role: str    = Form(...)
# ):
#     raw    = await file.read()
#     full   = extract_text(raw)
#     U      = full.upper()  # for consistent heading matching

#     # 1) Job Position Name
#     job = job_role or "null"

#     # 2) Career Objective
#     obj = grab_block(U, "CAREER OBJECTIVE") or grab_block(U, "OBJECTIVE") or "null"

#     # 3) Skills
#     skills_blk = grab_block(U, "SKILLS") or grab_block(U, "TECHNICAL SKILLS")
#     skills = [s.strip() for s in re.split(r"[\n,;•]+", skills_blk)] if skills_blk else None

#     # 4) Educational Institution Name + Degree + Passing Year + Results + Result Types + Major
#     edu_blk = grab_block(U, "EDUCATION")
#     insts, degs, years, results, rtypes, majors = None, None, None, None, None, None
#     if edu_blk:
#         lines = [l.strip() for l in edu_blk.split("\n") if l.strip()]
#         insts, degs, years, results, rtypes, majors = [], [], [], [], [], []
#         for ln in lines:
#             # crude split: assume "Inst  (Dates)" then maybe "Degree (GPA)" etc
#             parts = [p.strip() for p in re.split(r"\(\d{4}", ln)]
#             insts.append(parts[0])
#             # try parse degree in next line
#         # fallback to null if empty
#         insts = insts or None
#         # (for brevity you can extend this to parse degs, years, etc.)

#     # 5) Professional Company Names + Positions + Responsibilities
#     exp_blk = grab_block(U, "EXPERIENCE") or grab_block(U, "PROFESSIONAL EXPERIENCE")
#     profs, poss, resps = None, None, None
#     if exp_blk:
#         entries = re.split(r"\n(?=[A-Z][a-z]+.*\d{4})", exp_blk)
#         profs = []
#         poss  = []
#         resps = []
#         for ent in entries:
#             lines = ent.split("\n")
#             profs.append(lines[0])
#             # next line might contain position title
#             if len(lines)>1:
#                 poss.append(lines[1])
#             # everything else treat as responsibilities blob
#             resps.append("\n".join(lines[2:]))

#         profs = profs or None
#         poss  = poss  or None
#         resps = resps or None

#     # 6) Educational Requirements, Experience Requirement, Age Requirement
#     edu_req = grab_block(U, "EDUCATIONAL REQUIREMENTS") or "null"
#     exp_req = grab_block(U, "EXPERIENCE REQUIREMENT") or "null"
#     age_req = grab_block(U, "AGE REQUIREMENT") or "null"

#     # 7) Additional fields
#     resp1_blk = grab_block(U, "RESPONSIBILITIES")
#     resp1 = resp1_blk.split("\n") if resp1_blk else None

#     skills_req = grab_block(U, "SKILLS REQUIRED")
#     skills_req = [s.strip() for s in re.split(r"[\n,;•]+", skills_req)] if skills_req else None

#     # ─── assemble prompt ─────────────────────────────────
#     parts = [
#       f"Job Position Name: {job}",
#       f"Career Objective: {obj}",
#       f"Skills: {skills or 'null'}",
#       f"Educational Institution Name: {insts or 'null'}",
#       f"Degree Names: {degs or 'null'}",
#       f"Passing Years: {years or 'null'}",
#       f"Educational Results: {results or 'null'}",
#       f"Result Types: {rtypes or 'null'}",
#       f"Major Field Of Studies: {majors or 'null'}",
#       f"Professional Company Names: {profs or 'null'}",
#       f"Positions: {poss or 'null'}",
#       f"Responsibilities: {resps or 'null'}",
#       f"Educational Requirements: {edu_req}",
#       f"Experiencere Requirement: {exp_req}",
#       f"Age Requirement: {age_req}",
#       f"Responsibilities.1: {resp1 or 'null'}",
#       f"Skills Required: {skills_req or 'null'}",
#     ]
#     prompt = " give 5 if mostly null | ".join(parts)

#     # ─── tokenize & infer ───────────────────────────────
#     inputs = tokenizer(prompt, truncation=True, padding="max_length", max_length=512, return_tensors="pt")
#     with torch.no_grad():
#       score = float(model(**inputs).logits.squeeze().item())

#     return {"score": round(score,2)*100, "prompt": prompt}




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



