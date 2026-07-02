from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import logging
from dotenv import load_dotenv

# 1. Load environment variables before importing agents
load_dotenv()

# 2. Validate required environment variables
REQUIRED_KEYS = ["GROQ_API_KEY", "AVIATIONSTACK_API_KEY", "FOURSQUARE_CLIENT_ID", "FOURSQUARE_CLIENT_SECRET"]
missing = [key for key in REQUIRED_KEYS if not os.getenv(key)]
if missing:
    logging.error(f"Initialization Error: Missing environment variables: {', '.join(missing)}")

from agents.intent_extractor import extract_intent
from agents.research_agent import research_travel
from agents.planning_agent import build_itinerary

app = FastAPI(title="TripGenie AI Service", version="1.0.0")
logger = logging.getLogger("uvicorn.error")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripInputRequest(BaseModel):
    description: str


class PreferenceProfile(BaseModel):
    destination: str
    origin: Optional[str] = "New York, USA"
    departure_date: str
    return_date: str
    num_travelers: int
    budget: float
    travel_style: str


class ResearchRequest(BaseModel):
    preferences: PreferenceProfile


class PlanRequest(BaseModel):
    preferences: PreferenceProfile
    research_data: dict


@app.get("/")
def root():
    return {"message": "TripGenie AI Service is running"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "TripGenie AI Service"}


@app.post("/extract-intent")
async def extract_intent_route(req: TripInputRequest):
    try:
        result = await extract_intent(req.description)
        return {"success": True, "preferences": result}
    except Exception as e:
        logger.exception("Intent extraction failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/research")
async def research_route(req: ResearchRequest):
    try:
        result = await research_travel(req.preferences.model_dump())
        return {"success": True, "research_data": result}
    except Exception as e:
        logger.exception("Research agent failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/plan")
async def plan_route(req: PlanRequest):
    try:
        result = await build_itinerary(
            req.preferences.model_dump(),
            req.research_data
        )
        return {"success": True, "itinerary": result}
    except Exception as e:
        logger.exception("Planning agent failed")
        raise HTTPException(status_code=500, detail=str(e))