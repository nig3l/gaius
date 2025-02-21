from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
from src.models.llm import LightLLM
from src.utils.prompts import SECURITY_ASSESSMENT_PROMPT, THREAT_ANALYSIS_PROMPT

class BusinessRequest(BaseModel):
    context: str
    industry: str

app = FastAPI(
    title="Secret Agent",
    description="Lightweight Cybersecurity Defense Assistant",
    version="0.2.0"
)

llm = LightLLM()

@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "Welcome to Secret Agent - Your Small Business Cybersecurity Assistant"}

@app.post("/security-assessment")
async def get_security_assessment(request: BusinessRequest):
    try:
        prompt = SECURITY_ASSESSMENT_PROMPT.format(
            business_context=f"Industry: {request.industry}\nContext: {request.context}"
        )
        response = llm.generate_response(prompt)
        return {"assessment": response, "industry": request.industry}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/threat-analysis")
def get_threat_analysis(business_details: str) -> Dict[str, str]:
    prompt = THREAT_ANALYSIS_PROMPT.format(business_details=business_details)
    response = llm.generate_response(prompt)
    return {"analysis": response}
