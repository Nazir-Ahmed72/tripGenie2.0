import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = AsyncGroq(api_key=api_key)


async def extract_intent(description: str) -> dict:
    today = datetime.now().strftime("%Y-%m-%d")
    system_prompt = f"""You are a travel planning assistant.
Extract structured trip details from the user's natural language description.
Return ONLY a valid JSON object with these exact fields:
{{
  "destination": "city, country",
  "origin": "city user is departing from (default New York if not mentioned)",
  "departure_date": "YYYY-MM-DD",
  "return_date": "YYYY-MM-DD",
  "num_travelers": number,
  "budget": number,
  "travel_style": "adventure | cultural | relaxed | family",
  "interests": ["list", "of", "interests"]
}}
Rules:
- Today's date is {today}. If departure date not specified, use a date 30 days from today.
- If return date not specified, calculate from trip duration mentioned.
- If budget not mentioned, estimate based on destination and duration.
- travel_style defaults to cultural if not mentioned.
- Return ONLY the JSON object, no explanation, no markdown, no code fences.
"""

    response = await client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": description}
        ],
        temperature=0.2,
        max_tokens=500
    )

    raw = response.choices[0].message.content.strip()

    if "```" in raw:
        parts = raw.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{"):
                raw = part
                break

    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(raw[start:end])
        raise ValueError(f"Could not parse JSON from LLM response: {raw}")