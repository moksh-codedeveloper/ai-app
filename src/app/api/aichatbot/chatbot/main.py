import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import uuid

app = FastAPI()
load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_AI_KEY")

# ✅ Request models
class ChatRequest(BaseModel):
    message: str

class SummarizationRequest(BaseModel):
    text: str

# ✅ Common AI Call Function
def call_together_ai(message: str):
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {"Authorization": f"Bearer {TOGETHER_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "messages": [{"role": "user", "content": message}],
        "max_tokens": 200,
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    print("Together AI Response:", data)  # Debugging

    if "choices" in data and len(data["choices"]) > 0:
        return data["choices"][0].get("message", {}).get("content", "No response")
    else:
        return "Error: No valid response from AI"

# ✅ Chatbot Endpoint
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response_text = call_together_ai(request.message)
        print("Final Response:", response_text)  # Debugging
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Common Summarization Function
def summarize_text(text: str, context: str):
    headers = {"Authorization": f"Bearer {TOGETHER_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        "prompt": f"{context}\n\n{text}",
        "max_tokens": 100,
        "temperature": 0.2,
        "query_id": str(uuid.uuid4())  # Prevents caching issues
    }

    response = requests.post("https://api.together.xyz/v1/completions", json=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Failed to summarize: {response.text}")
    print(text)
    return response.json().get("choices", [{}])[0].get("text", "").strip()

# ✅ Summarization Endpoint for Case Studies (Files)
@app.post("/summarizeFile")
async def summarize_file(request: SummarizationRequest):
    summary = summarize_text(
        request.text,
        "Summarize the following accurately and concisely."
    )
    return {"summary": summary}

# ✅ Summarization Endpoint for Notes (General Summarization)
@app.post("/summarizeNote")
async def summarize_note(request: SummarizationRequest):
    summary = summarize_text(
        request.text,
        "Summarize the following **notes concisely** while maintaining all key details."
    )
    return {"summary": summary}
