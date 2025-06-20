
# import os
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from openai import OpenAI  
# import traceback

# load_dotenv()


# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# if not os.getenv("OPENAI_API_KEY"):
#     raise RuntimeError("Missing OPENAI_API_KEY in environment")

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class SWOTRequest(BaseModel):
#     score: float
#     prompt: str

# class SWOTResponse(BaseModel):
#     swot: str

# @app.post("/swot", response_model=SWOTResponse)
# async def generate_swot(body: SWOTRequest):
#     system_msg = "You are a helpful HR analyst. Given a candidate's resume summary and score, produce a concise SWOT analysis with Strengths, Weaknesses, Opportunities, improvements in two paragraph 150 words each."
#     user_msg = f"Score: {body.score}/100\nPrompt:\n```\n{body.prompt}\n```"
    
#     try:
#         print("Calling OpenAI with system_msg:")
#         print(system_msg)
#         print("and user_msg:")
#         print(user_msg)
#         print("OPENAI_API_KEY is: ", os.getenv("OPENAI_API_KEY")[:10] + "…")
        
#         resp = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": system_msg},
#                 {"role": "user", "content": user_msg},
#             ],
#             temperature=0.7,
#             max_tokens=400,
#         )
        
#         swot_text = resp.choices[0].message.content.strip()
#         print("OpenAI returned SWOT:", swot_text[:100], "…")
#         return SWOTResponse(swot=swot_text)
        
#     except Exception as e:
#         print("Exception in /swot endpoint:")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))



# import io
# import os
# import json
# import traceback

# from dotenv import load_dotenv
# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from openai import OpenAI
# import pdfplumber
# from pdf2image import convert_from_path
# import pytesseract

# load_dotenv()
# API_KEY = os.getenv("OPENAI_API_KEY")
# if not API_KEY:
#     raise RuntimeError("Missing OPENAI_API_KEY in environment")
# client = OpenAI(api_key=API_KEY)

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"] ,  # allow all origins or restrict as needed
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def extract_text_from_pdf(pdf_path: str) -> str:
#     """
#     Read only the first two pages of a PDF and return their text.
#     First tries pdfplumber; if that yields nothing, falls back to OCR.
#     """
#     text = ""
#     try:
#         # Direct extraction of first two pages
#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages[:2]:
#                 if page_text := page.extract_text():
#                     text += page_text
#         if text.strip():
#             return text.strip()
#     except Exception as e:
#         print(f"Direct extraction failed: {e}")

#     # OCR fallback for first two pages
#     print("Falling back to OCR for the first two pages.")
#     try:
#         images = convert_from_path(pdf_path)
#         for img in images[:2]:
#             text += pytesseract.image_to_string(img) + "\n"
#     except Exception as e:
#         print(f"OCR failed: {e}")

#     return text.strip()

# @app.post("/analyze-resume")
# async def analyze_resume(
#     file: UploadFile = File(...),
#     job_role: str    = Form(...)
# ):
#     try:
#         # 1) Save PDF
#         raw = await file.read()
#         tmp_path = "uploaded_resume.pdf"
#         with open(tmp_path, "wb") as f:
#             f.write(raw)

#         # 2) Extract text
#         resume_text = extract_text_from_pdf(tmp_path)

#         # 3) Build prompt for score & category
#         prompt = (
#             f"Job Position Name: {job_role or 'null'}\n\n"
#             f"Resume Text:\n```\n{resume_text}\n```"
#         )
#         system_msg = (
#             "You are a senior HR recruiter. Given the candidate's resume text "
#             "and desired Job Position Name, return *only* a JSON object with:\n"
#             "  • score: a number from 0 to 100 (0=poor, 100=excellent)\n"
#             "  • category: one of [Excellent, Good, Fair, Poor]\n"
#             "Penalize vague language, missing role alignment, or lack of metrics."
#         )
#         resp = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": system_msg},
#                 {"role": "user",   "content": prompt},
#             ],
#             temperature=0,
#             max_tokens=60,
#         )
#         result = json.loads(resp.choices[0].message.content.strip())
#         score = result.get("score")
#         category = result.get("category")

#         # 4) Build prompt for SWOT
#         swot_system = (
#             "You are a helpful HR analyst. Given a candidate's resume summary and score, "
#             "produce a concise SWOT analysis with Strengths, Weaknesses, Opportunities, "
#             "and Improvements in two paragraphs of ~150 words each."
#         )
#         swot_user = f"Score: {score}/100\nPrompt:\n```\n{prompt}\n```"
#         swot_resp = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": swot_system},
#                 {"role": "user",   "content": swot_user},
#             ],
#             temperature=0.7,
#             max_tokens=400,
#         )
#         swot_text = swot_resp.choices[0].message.content.strip()

#         # 5) Return combined response
#         return {
#             "score":    score,
#             "category": category,
#             "prompt":   prompt,
#             "swot":     swot_text,
#         }

#     except Exception:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Failed to analyze resume and generate SWOT")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

