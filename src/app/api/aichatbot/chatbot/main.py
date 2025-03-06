from fastapi import FastAPI, Query
from pydantic import BaseModel
import requests

app = FastAPI()

# Together AI API
TOGETHER_AI_URL = "https://api.together.xyz/v1/completions"
TOGETHER_AI_KEY = "tgp_v1_zlFKDYH4KXQdT6TL6wZHNF3ai7HRQ2rEM6N54MzupqM"
TOGETHER_MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"

# Search APIs
SERPAPI_KEY = "YOUR_SERPAPI_KEY"
DUCKDUCKGO_FREE_API = "https://api.duckduckgo.com/?format=json&q="

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    payload = {
        "model": TOGETHER_MODEL,
        "prompt": request.message,
        "max_tokens": 100,
        "temperature": 0.7
    }
    headers = {"Authorization": f"Bearer {TOGETHER_AI_KEY}", "Content-Type": "application/json"}
    
    response = requests.post(TOGETHER_AI_URL, json=payload, headers=headers)
    return response.json()

@app.get("/search")
def search(q: str = Query(..., title="Search Query")):
    serpapi_url = f"https://serpapi.com/search.json?q={q}&api_key={SERPAPI_KEY}"
    duckduckgo_url = f"{DUCKDUCKGO_FREE_API}{q}"

    serp_response = requests.get(serpapi_url)
    duck_response = requests.get(duckduckgo_url)

    return {
        "serpapi": serp_response.json() if serp_response.status_code == 200 else {},
        "duckduckgo": duck_response.json() if duck_response.status_code == 200 else {}
    }
