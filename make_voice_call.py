"""Make an outbound Voice AI call using Vapi.ai.

Usage:
    1. Add VAPI_API_KEY and MY_PHONE_NUMBER to backend/.env
    2. Run: python make_voice_call.py
"""

import os
import sys
import requests
from dotenv import load_dotenv

# Load env vars from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))

VAPI_API_KEY = os.getenv("VAPI_API_KEY", "")
MY_PHONE_NUMBER = os.getenv("MY_PHONE_NUMBER", "")

if not VAPI_API_KEY:
    print("ERROR: VAPI_API_KEY is missing from backend/.env")
    sys.exit(1)

if not MY_PHONE_NUMBER:
    print("ERROR: MY_PHONE_NUMBER is missing from backend/.env")
    print("  Format: +972XXXXXXXXX  (e.g. +972541234567)")
    sys.exit(1)

# Import the system prompt from the voice agent config
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
from app.services.voice_agent_config import VOICE_AGENT_SYSTEM_PROMPT

VAPI_ENDPOINT = "https://api.vapi.ai/call/phone"

payload = {
    "assistant": {
        "model": {
            "provider": "anthropic",
            "model": "claude-sonnet-4-20250514",
            "messages": [
                {
                    "role": "system",
                    "content": VOICE_AGENT_SYSTEM_PROMPT,
                }
            ],
        },
        "voice": {
            "provider": "azure",
            "voiceId": "he-IL-AvriNeural",
        },
        "firstMessage": "אהלן, מדבר תומר מברק שירותים, מה קורה?",
        "transcriber": {
            "provider": "deepgram",
            "language": "he",
        },
    },
    "phoneNumberId": None,  # Uses Vapi's default outbound number
    "customer": {
        "number": MY_PHONE_NUMBER,
    },
}

print(f"Calling {MY_PHONE_NUMBER} with Tomer (Voice AI Agent)...")
print()

response = requests.post(
    VAPI_ENDPOINT,
    json=payload,
    headers={
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json",
    },
)

if response.status_code in (200, 201):
    data = response.json()
    print("Call initiated successfully!")
    print(f"  Call ID: {data.get('id', 'N/A')}")
    print(f"  Status:  {data.get('status', 'N/A')}")
    print()
    print("Your phone should ring in a few seconds. Tomer will speak in Hebrew!")
else:
    print(f"ERROR: Vapi returned {response.status_code}")
    print(response.text)
    sys.exit(1)
