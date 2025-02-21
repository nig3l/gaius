from fastapi import FastAPI
from typing import Dict

app = FastAPI(
    title="Secret Agent",
    description="Cybersecurity defense assistant for small businesses",
    version="0.1.0"
)

@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "Welcome to Secret Agent - Your Small Business Cybersecurity Assistant"}
