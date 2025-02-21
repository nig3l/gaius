from fastapi import FastAPI
from typing import Dict
from src.models.llm import DeepSeekLLM
from src.utils.prompts import SECURITY_ASSESSMENT_PROMPT, THREAT_ANALYSIS_PROMPT

app = FastAPI(
    title="Secret Agent",
    description="Cybersecurity defense assistant for small businesses",
    version="0.1.0"
)

llm = DeepSeekLLM()

@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "Welcome to Secret Agent - Your Small Business Cybersecurity Assistant"}

@app.post("/security-assessment")
def get_security_assessment(business_context: str) -> Dict[str, str]:
    prompt = SECURITY_ASSESSMENT_PROMPT.format(business_context=business_context)
    response = llm.generate_response(prompt)
    return {"assessment": response}

@app.post("/threat-analysis")
def get_threat_analysis(business_details: str) -> Dict[str, str]:
    prompt = THREAT_ANALYSIS_PROMPT.format(business_details=business_details)
    response = llm.generate_response(prompt)
    return {"analysis": response}
