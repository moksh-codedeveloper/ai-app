import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
app = FastAPI()
load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_AI_KEY")

class ChatRequest(BaseModel):
    message: str

def call_together_ai(message: str):
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {"Authorization": f"Bearer {TOGETHER_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "messages": [{"role": "user", "content": message}],
        "max_tokens": 200
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    print("Together AI Response:", data)  # Debugging

    if "choices" in data and len(data["choices"]) > 0:
        return data["choices"][0].get("message", {}).get("content", "No response")
    else:
        return "Error: No valid response from AI"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response_text = call_together_ai(request.message)
        print("Final Response:", response_text)  # Debugging
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarize_text(data: dict):
    text = data.get("text")
    
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    headers = {"Authorization": f"Bearer {TOGETHER_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "togethercomputer/mixtral-8x7b-instruct",
        "prompt": f"Summarize this: {text}",
        "max_tokens": 150
    }

    response = requests.post("https://api.together.xyz/v1/completions", json=payload, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to summarize")

    summary = response.json().get("choices", [{}])[0].get("text", "").strip()
    return {"summary": summary}