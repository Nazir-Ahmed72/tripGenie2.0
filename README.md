# TripGenie – AI-Powered Travel Itinerary Builder

TripGenie is a full-stack AI travel planning application that takes a plain English trip description and automatically generates a complete personalized day-by-day travel itinerary using a five-stage AI agent pipeline.

## What It Does

A user types something like "I want a 7 day cultural trip to Japan for 2 people with a budget of 3000 dollars in April" and TripGenie automatically handles everything from understanding the request to delivering a complete structured itinerary with flights, hotels, activities, and a budget breakdown.

## Five AI Agent Pipeline

| Module | Agent | What it does |
|---|---|---|
| Module 1 | User Intent Extractor | Parses natural language into structured travel parameters |
| Module 2 | Research Agent | Fetches real flights, hotels, and activities from APIs |
| Module 3 | Planning Agent | Builds a conflict-free day-by-day schedule |
| Module 4 | Budget Optimizer | Adjusts plan to fit within stated budget |
| Module 5 | Description Generator | Writes engaging travel narrative for each day |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React JS 18 with Tailwind CSS |
| Backend | Node.js with Express |
| AI Service | Python FastAPI |
| Database | MongoDB |
| LLM | Groq API with llama-3.3-70b-versatile |
| Flights | Aviationstack API |
| Hotels and Places | Foursquare API |
| Activities | OpenTripMap API |

## Project Structure