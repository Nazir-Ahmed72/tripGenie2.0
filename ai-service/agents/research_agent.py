import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────
# AviationStack – flight data
# ─────────────────────────────────────────
AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
AVIATION_BASE_URL = "http://api.aviationstack.com/v1"

# ─────────────────────────────────────────
# Foursquare – hotels & activities
# ─────────────────────────────────────────
FOURSQUARE_CLIENT_ID = os.getenv("FOURSQUARE_CLIENT_ID")
FOURSQUARE_CLIENT_SECRET = os.getenv("FOURSQUARE_CLIENT_SECRET")
FOURSQUARE_BASE_URL = "https://api.foursquare.com/v2"

# Fallback IATA lookup for cities not returned by AviationStack airport search
AIRPORT_DB = {
    "paris": "CDG",
    "london": "LHR",
    "new york": "JFK",
    "tokyo": "HND",
    "rome": "FCO",
    "barcelona": "BCN",
    "dubai": "DXB",
    "singapore": "SIN",
    "amsterdam": "AMS",
    "sydney": "SYD",
    "bangkok": "BKK",
    "istanbul": "IST",
    "los angeles": "LAX",
    "chicago": "ORD",
    "san francisco": "SFO",
    "miami": "MIA",
    "toronto": "YYZ",
    "vancouver": "YVR",
    "berlin": "BER",
    "munich": "MUC",
    "frankfurt": "FRA",
    "madrid": "MAD",
}


# ─────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────

def _foursquare_base_params() -> dict:
    return {
        "client_id": FOURSQUARE_CLIENT_ID,
        "client_secret": FOURSQUARE_CLIENT_SECRET,
        "v": "20240601",
    }


def _resolve_iata(city_str: str) -> str:
    """Return an IATA code for a city string.

    First tries the local lookup table, then falls back to the AviationStack
    airports endpoint, and finally derives a 3-letter code from the city name.
    """
    city_lower = city_str.lower()
    for key, iata in AIRPORT_DB.items():
        if key in city_lower:
            return iata

    # Try AviationStack airport search
    if AVIATIONSTACK_API_KEY:
        try:
            resp = requests.get(
                f"{AVIATION_BASE_URL}/airports",
                params={
                    "access_key": AVIATIONSTACK_API_KEY,
                    "search": city_str.split(",")[0].strip(),
                    "limit": 1,
                },
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json().get("data", [])
            if data and data[0].get("iata_code"):
                return data[0]["iata_code"].upper()
        except Exception:
            pass

    # Last-resort: derive a 3-letter code
    cleaned = "".join(c for c in city_lower if c.isalpha())[:3].upper()
    return cleaned if len(cleaned) == 3 else "UNK"


# ─────────────────────────────────────────
# Flights via AviationStack
# ─────────────────────────────────────────

def get_flights(destination: str, origin: str, departure_date: str, return_date: str) -> list:
    if not AVIATIONSTACK_API_KEY:
        raise ValueError("AVIATIONSTACK_API_KEY must be set in .env")

    origin_iata = _resolve_iata(origin)
    dest_iata = _resolve_iata(destination)

    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "dep_iata": origin_iata,
        "arr_iata": dest_iata,
        "limit": 5,
    }

    resp = requests.get(f"{AVIATION_BASE_URL}/flights", params=params, timeout=15)
    resp.raise_for_status()
    api_data = resp.json().get("data", [])

    if not api_data:
        raise ValueError(
            f"No flights returned from AviationStack for route {origin_iata} → {dest_iata}"
        )

    mapped_flights = []
    for idx, f in enumerate(api_data[:5]):
        airline = f.get("airline", {})
        departure = f.get("departure", {})
        arrival = f.get("arrival", {})

        airline_name = airline.get("name", "Unknown Airline")
        flight_number = f.get("flight", {}).get("iata", f"FL{idx+1}")

        dep_time = departure.get("scheduled") or f"{departure_date}T{8 + idx * 2:02d}:00:00"
        arr_time = arrival.get("scheduled") or dep_time

        # Estimate flight duration from scheduled times if available
        try:
            dep_dt = datetime.fromisoformat(dep_time.replace("Z", "+00:00"))
            arr_dt = datetime.fromisoformat(arr_time.replace("Z", "+00:00"))
            duration_secs = (arr_dt - dep_dt).total_seconds()
            if duration_secs <= 0:
                duration_secs = 6 * 3600
        except Exception:
            duration_secs = 6 * 3600

        h_val = int(duration_secs // 3600)
        m_val = int((duration_secs % 3600) // 60)
        duration_str = f"{h_val}h {m_val:02d}m"
        duration_hours = duration_secs / 3600.0

        price = round(450.0 + (duration_hours * 45.0) + (idx * 25.0), 2)
        stops_str = "Non-stop" if duration_hours < 8 else "1 stop"
        seats_left = (7 + idx * 3) % 18 + 1

        mapped_flights.append({
            "id": flight_number,
            "airline": airline_name,
            "airline_iata": airline.get("iata", ""),
            "flight_number": flight_number,
            "departure_city": origin.split(",")[0].strip(),
            "departure_code": departure.get("iata", origin_iata).upper(),
            "arrival_city": destination.split(",")[0].strip(),
            "arrival_code": arrival.get("iata", dest_iata).upper(),
            "departure_time": dep_time,
            "arrival_time": arr_time,
            "departure_terminal": departure.get("terminal", "N/A"),
            "arrival_terminal": arrival.get("terminal", "N/A"),
            "duration": duration_str,
            "stops": stops_str,
            "flight_status": f.get("flight_status", "scheduled"),
            "flight_date": f.get("flight_date", departure_date),
            "price": price,
            "currency": "USD",
            "class": "Economy" if idx % 3 != 0 else "Business",
            "seats_left": seats_left,
        })

    return mapped_flights


# ─────────────────────────────────────────
# Hotels via Foursquare
# ─────────────────────────────────────────

def get_hotels(destination: str, check_in: str, check_out: str) -> list:
    if not FOURSQUARE_CLIENT_ID or not FOURSQUARE_CLIENT_SECRET:
        raise ValueError("FOURSQUARE_CLIENT_ID and FOURSQUARE_CLIENT_SECRET must be set in .env")

    city = destination.split(",")[0].strip()
    url = f"{FOURSQUARE_BASE_URL}/venues/search"
    params = {
        **_foursquare_base_params(),
        "near": city,
        "categoryId": "4bf58dd8d48988d1fa931735",  # Hotel category
        "limit": 5,
    }

    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    venues = resp.json().get("response", {}).get("venues", [])

    if not venues:
        raise ValueError(f"No hotels returned from Foursquare for {destination}")

    mapped_hotels = []
    for idx, venue in enumerate(venues):
        location = venue.get("location", {})
        price_tier = venue.get("price", {}).get("tier", 2)  # 1-4 scale

        # Translate Foursquare price tier to a per-night USD estimate
        tier_to_price = {1: 85.0, 2: 145.0, 3: 260.0, 4: 480.0}
        price_per_night = tier_to_price.get(price_tier, 145.0)

        rating = venue.get("rating", 0) or 4.0  # Foursquare: 0-10
        rating_5 = round(rating / 2, 1)          # Normalise to 0-5
        stars = max(3, min(5, int(round(rating_5))))

        amenities = ["WiFi", "AC"]
        defaults = ["Breakfast", "Room Service", "Minibar", "Concierge"]
        for amenity in defaults:
            if len(amenities) < 5:
                amenities.append(amenity)

        mapped_hotels.append({
            "id": venue.get("id") or f"h_{idx}",
            "name": venue.get("name", "Unknown Hotel"),
            "stars": stars,
            "address": location.get("formattedAddress", ["N/A"])[0],
            "city": location.get("city", city),
            "lat": location.get("lat"),
            "lon": location.get("lng"),
            "rating": rating_5,
            "reviews": venue.get("stats", {}).get("checkinsCount", 100),
            "price_per_night": price_per_night,
            "currency": "USD",
            "amenities": amenities,
            "check_in": check_in,
            "check_out": check_out,
            "image": "🏨",
            "distance_meters": location.get("distance", 0),
        })

    return mapped_hotels


# ─────────────────────────────────────────
# Activities via Foursquare
# ─────────────────────────────────────────

# Foursquare category IDs mapped to travel style (same as foursquare_test.py)
STYLE_CATEGORIES = {
    "cultural": [
        "4deefb944765f83613cdba6e",  # Historic site
        "4bf58dd8d48988d1e2931735",  # Art museum
        "4bf58dd8d48988d18f941735",  # Science museum
    ],
    "adventure": [
        "4bf58dd8d48988d159941735",  # Park
        "4bf58dd8d48988d1e7941735",  # National park
        "52e81612bcbc57f1066b7a22",  # Hiking trail
    ],
    "relaxed": [
        "4bf58dd8d48988d1df941735",  # Spa
        "4bf58dd8d48988d159941735",  # Park
        "4bf58dd8d48988d1e4941735",  # Garden
    ],
    "family": [
        "4bf58dd8d48988d182941735",  # Amusement park
        "4bf58dd8d48988d17b941735",  # Zoo
        "4bf58dd8d48988d1e2931735",  # Museum
    ],
}

# Icon mapping based on Foursquare category name keywords
CATEGORY_ICONS = {
    "museum": "🏛️",
    "art": "🎨",
    "park": "🌿",
    "garden": "🌸",
    "historic": "🏰",
    "monument": "🏰",
    "spa": "💆",
    "zoo": "🦁",
    "amusement": "🎡",
    "restaurant": "🍜",
    "food": "🍜",
    "hiking": "🥾",
    "trail": "🥾",
}


def _icon_for_category(category_name: str) -> str:
    name_lower = category_name.lower()
    for keyword, icon in CATEGORY_ICONS.items():
        if keyword in name_lower:
            return icon
    return "🗺️"


def get_activities(destination: str, travel_style: str) -> list:
    if not FOURSQUARE_CLIENT_ID or not FOURSQUARE_CLIENT_SECRET:
        raise ValueError("FOURSQUARE_CLIENT_ID and FOURSQUARE_CLIENT_SECRET must be set in .env")

    city = destination.split(",")[0].strip()
    categories = STYLE_CATEGORIES.get(travel_style.lower(), STYLE_CATEGORIES["cultural"])
    limit = 10
    per_category = max(1, limit // len(categories))

    all_venues = []
    for cat_id in categories:
        url = f"{FOURSQUARE_BASE_URL}/venues/search"
        params = {
            **_foursquare_base_params(),
            "near": city,
            "categoryId": cat_id,
            "limit": per_category,
        }
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        venues = resp.json().get("response", {}).get("venues", [])

        for idx, venue in enumerate(venues):
            location = venue.get("location", {})
            price_tier = venue.get("price", {}).get("tier", 1)
            category_name = venue.get("categories", [{}])[0].get("name", "Attraction")
            rating = venue.get("rating", 0) or 4.0

            all_venues.append({
                "id": venue.get("id") or f"a_{idx}",
                "name": venue.get("name", "Unknown Place"),
                "type": category_name,
                "icon": _icon_for_category(category_name),
                "address": location.get("formattedAddress", ["N/A"])[0],
                "city": location.get("city", city),
                "lat": location.get("lat"),
                "lon": location.get("lng"),
                "rating": round(rating / 2, 1),  # normalise to 0-5
                "reviews": venue.get("stats", {}).get("checkinsCount", 100),
                "estimated_cost": price_tier * 10,
                "duration_hours": 2,
                "description": f"Visit {venue.get('name', 'this attraction')} in {city}.",
                "best_time": ["Morning", "Afternoon", "Evening"][idx % 3],
                "distance_meters": location.get("distance", 0),
            })

    # Also pull restaurants to round out the activities list
    restaurants = _get_restaurants(city, limit=5)
    all_activities = (all_venues + restaurants)[:12]

    if not all_activities:
        raise ValueError(f"No activities returned from Foursquare for {destination}")

    return all_activities


def _get_restaurants(city: str, limit: int = 5) -> list:
    """Internal helper – fetch restaurants from Foursquare."""
    url = f"{FOURSQUARE_BASE_URL}/venues/search"
    params = {
        **_foursquare_base_params(),
        "near": city,
        "categoryId": "4d4b7105d754a06374d81259",  # Food category
        "limit": limit,
    }
    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    venues = resp.json().get("response", {}).get("venues", [])

    restaurants = []
    for idx, venue in enumerate(venues):
        location = venue.get("location", {})
        price_tier = venue.get("price", {}).get("tier", 1)
        rating = venue.get("rating", 0) or 4.0

        restaurants.append({
            "id": venue.get("id") or f"r_{idx}",
            "name": venue.get("name", "Unknown Restaurant"),
            "type": "Restaurant",
            "icon": "🍜",
            "address": location.get("formattedAddress", ["N/A"])[0],
            "city": location.get("city", city),
            "lat": location.get("lat"),
            "lon": location.get("lng"),
            "rating": round(rating / 2, 1),
            "reviews": venue.get("stats", {}).get("checkinsCount", 50),
            "estimated_cost": price_tier * 15,
            "duration_hours": 1.5,
            "description": f"Enjoy a meal at {venue.get('name', 'this restaurant')} in {city}.",
            "best_time": "Evening",
            "distance_meters": location.get("distance", 0),
        })

    return restaurants


# ─────────────────────────────────────────
# Main research entry-point
# ─────────────────────────────────────────

async def research_travel(preferences: dict) -> dict:
    destination = preferences.get("destination", "Paris, France")
    origin = preferences.get("origin", "New York, USA")
    departure_date = preferences.get("departure_date", "2026-06-01")
    return_date = preferences.get("return_date", "2026-06-08")
    travel_style = preferences.get("travel_style", "cultural")

    # Validate departure date is not in the past
    try:
        dep_dt = datetime.strptime(departure_date, "%Y-%m-%d").date()
        if dep_dt < datetime.now().date():
            raise ValueError(
                f"Departure date {departure_date} cannot be in the past. "
                f"Today is {datetime.now().date()}."
            )
    except ValueError as e:
        raise ValueError(str(e))

    flights = get_flights(destination, origin, departure_date, return_date)
    hotels = get_hotels(destination, departure_date, return_date)
    activities = get_activities(destination, travel_style)

    return {
        "flights": flights,
        "hotels": hotels,
        "activities": activities,
        "destination": destination,
        "departure_date": departure_date,
        "return_date": return_date,
    }