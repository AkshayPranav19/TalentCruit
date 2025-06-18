
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI  
import traceback

load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

if not os.getenv("OPENAI_API_KEY"):
    raise RuntimeError("Missing OPENAI_API_KEY in environment")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SWOTRequest(BaseModel):
    score: float
    prompt: str

class SWOTResponse(BaseModel):
    swot: str

@app.post("/swot", response_model=SWOTResponse)
async def generate_swot(body: SWOTRequest):
    system_msg = "You are a helpful HR analyst. Given a candidate's resume summary and score, produce a concise SWOT analysis with Strengths, Weaknesses, Opportunities, improvements in two paragraph 150 words each."
    user_msg = f"Score: {body.score}/100\nPrompt:\n```\n{body.prompt}\n```"
    
    try:
        print("Calling OpenAI with system_msg:")
        print(system_msg)
        print("and user_msg:")
        print(user_msg)
        print("OPENAI_API_KEY is: ", os.getenv("OPENAI_API_KEY")[:10] + "…")
        
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.7,
            max_tokens=400,
        )
        
        swot_text = resp.choices[0].message.content.strip()
        print("OpenAI returned SWOT:", swot_text[:100], "…")
        return SWOTResponse(swot=swot_text)
        
    except Exception as e:
        print("Exception in /swot endpoint:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))



