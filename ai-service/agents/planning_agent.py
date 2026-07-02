import os
import json
from datetime import datetime, timedelta
from groq import AsyncGroq
from dotenv import load_dotenv

# Flight data: AviationStack API  (via research_agent.get_flights)
# Hotel data:  Foursquare API     (via research_agent.get_hotels)
# Activity data: Foursquare API   (via research_agent.get_activities)

load_dotenv()
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))


def calculate_trip_days(departure_date: str, return_date: str) -> int:
    d1 = datetime.strptime(departure_date, "%Y-%m-%d")
    d2 = datetime.strptime(return_date, "%Y-%m-%d")
    return max(1, (d2 - d1).days)


def assign_time_slots(activities: list, num_days: int) -> list:
    time_labels = {
        "morning": "09:00 AM",
        "afternoon": "02:00 PM",
        "evening": "07:00 PM"
    }
    slots_order = ["morning", "afternoon", "evening"]
    schedule = []
    idx = 0

    for day in range(1, num_days + 1):
        day_plan = {"day": day, "slots": {}}
        for slot in slots_order:
            if idx < len(activities):
                act = activities[idx].copy()
                act["slot"] = slot
                act["time"] = time_labels[slot]
                day_plan["slots"][slot] = act
                idx += 1
            else:
                day_plan["slots"][slot] = None
        schedule.append(day_plan)

    return schedule


async def build_itinerary(preferences: dict, research_data: dict) -> dict:
    departure_date = preferences.get("departure_date", "2026-06-01")
    return_date = preferences.get("return_date", "2026-06-08")
    destination = preferences.get("destination", "Paris, France")
    travel_style = preferences.get("travel_style", "cultural")
    num_travelers = preferences.get("num_travelers", 2)
    budget = preferences.get("budget", 3000)

    num_days = calculate_trip_days(departure_date, return_date)

    flights = research_data.get("flights", [])
    hotels = research_data.get("hotels", [])
    activities = research_data.get("activities", [])

    # Select cheapest flight (AviationStack data includes a computed 'price' field)
    selected_flight = min(flights, key=lambda f: f.get("price", 9999)) if flights else None
    # Select first hotel (Foursquare data; price is stored as 'price_per_night')
    selected_hotel = hotels[0] if hotels else None

    daily_schedule = assign_time_slots(activities, num_days)

    activity_names = ", ".join([a["name"] for a in activities[:9]])
    prompt = f"""You are a travel planner. Create brief one-sentence descriptions for each day of a {num_days}-day {travel_style} trip to {destination}.

Activities: {activity_names}

Return ONLY a JSON array of exactly {num_days} strings. Example:
["Explore the historic old town and visit the national museum.", "Relax at the waterfront and enjoy a local food tour."]

Return ONLY the JSON array. No explanation, no markdown."""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=500
        )
        raw = response.choices[0].message.content.strip()
        if "```" in raw:
            parts = raw.split("```")
            for part in parts:
                part = part.strip()
                if part.startswith("json"):
                    part = part[4:].strip()
                if part.startswith("["):
                    raw = part
                    break
        raw = raw.strip()
        start = raw.find("[")
        end = raw.rfind("]") + 1
        if start != -1 and end > start:
            raw = raw[start:end]
        day_summaries = json.loads(raw)
        if not isinstance(day_summaries, list):
            raise ValueError("Not a list")
        if len(day_summaries) < num_days:
            raise ValueError(f"LLM provided only {len(day_summaries)} summaries for a {num_days} day trip.")
    except Exception as e:
        raise RuntimeError(f"Planning Agent LLM call failed: {str(e)}")

    for i, day in enumerate(daily_schedule):
        day["summary"] = day_summaries[i]
        day["date"] = (datetime.strptime(departure_date, "%Y-%m-%d") + timedelta(days=i)).strftime("%Y-%m-%d")

    # Flight cost: AviationStack-sourced flights carry a computed 'price' per person
    flight_cost = (selected_flight.get("price", 0) * num_travelers) if selected_flight else 0
    # Hotel cost: Foursquare-sourced hotels use 'price_per_night'
    hotel_cost = (selected_hotel.get("price_per_night", 0) * num_days * num_travelers) if selected_hotel else 0
    # Activity cost: Foursquare-sourced activities use 'estimated_cost' per person
    activity_cost = sum(
        day["slots"].get(slot, {}).get("estimated_cost", 0) or 0
        for day in daily_schedule
        for slot in ["morning", "afternoon", "evening"]
        if day["slots"].get(slot)
    ) * num_travelers
    misc_cost = round(budget * 0.05, 2)
    total_cost = round(flight_cost + hotel_cost + activity_cost + misc_cost, 2)

    return {
        "destination": destination,
        "departure_date": departure_date,
        "return_date": return_date,
        "num_days": num_days,
        "num_travelers": num_travelers,
        "travel_style": travel_style,
        "selected_flight": selected_flight,
        "selected_hotel": selected_hotel,
        "daily_schedule": daily_schedule,
        "cost_breakdown": {
            "flights": round(flight_cost, 2),
            "accommodation": round(hotel_cost, 2),
            "activities": round(activity_cost, 2),
            "miscellaneous": misc_cost,
            "total": total_cost
        },
        "budget": budget,
        "within_budget": total_cost <= budget * 1.05
    }