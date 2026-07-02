import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("FOURSQUARE_CLIENT_ID")
CLIENT_SECRET = os.getenv("FOURSQUARE_CLIENT_SECRET")
BASE_URL = "https://api.foursquare.com/v2"

# Common params required for every request
def base_params():
    return {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "v": "20240601"
    }


# ─────────────────────────────────────────
# Search Hotels
# ─────────────────────────────────────────
def get_hotels(city, limit=5):
    print(f"\nFetching hotels in {city}")
    url = f"{BASE_URL}/venues/search"
    params = {
        **base_params(),
        "near": city,
        "categoryId": "4bf58dd8d48988d1fa931735",  # Hotel category
        "limit": limit
    }
    response = requests.get(url, params=params, timeout=15)
    print(f"Status: {response.status_code}")
    data = response.json()

    venues = data.get("response", {}).get("venues", [])
    print(f"Hotels found: {len(venues)}")

    hotels = []
    for venue in venues:
        location = venue.get("location", {})
        price = venue.get("price", {}).get("tier", 2)
        hotels.append({
            "id": venue.get("id"),
            "name": venue.get("name", "Unknown Hotel"),
            "address": location.get("formattedAddress", ["N/A"])[0],
            "city": location.get("city", city),
            "lat": location.get("lat"),
            "lon": location.get("lng"),
            "rating": venue.get("rating", 0),
            "price_level": price,
            "price_per_night": price * 50,
            "distance_meters": location.get("distance", 0),
            "category": "Hotel"
        })
    return hotels


# ─────────────────────────────────────────
# Search Tourist Attractions
# ─────────────────────────────────────────
def get_tourist_attractions(city, travel_style="cultural", limit=10):
    print(f"\nFetching {travel_style} attractions in {city}")

    # Foursquare category IDs for each travel style
    style_categories = {
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
        ]
    }

    categories = style_categories.get(
        travel_style.lower(),
        style_categories["cultural"]
    )

    all_venues = []
    per_category = max(1, limit // len(categories))

    for cat_id in categories:
        url = f"{BASE_URL}/venues/search"
        params = {
            **base_params(),
            "near": city,
            "categoryId": cat_id,
            "limit": per_category
        }
        response = requests.get(url, params=params, timeout=15)
        print(f"Category {cat_id} status: {response.status_code}")
        data = response.json()
        venues = data.get("response", {}).get("venues", [])
        print(f"Found {len(venues)} places")

        for venue in venues:
            location = venue.get("location", {})
            price = venue.get("price", {}).get("tier", 1)
            all_venues.append({
                "id": venue.get("id"),
                "name": venue.get("name", "Unknown Place"),
                "address": location.get("formattedAddress", ["N/A"])[0],
                "city": location.get("city", city),
                "lat": location.get("lat"),
                "lon": location.get("lng"),
                "category": venue.get("categories", [{}])[0].get("name", "Attraction"),
                "rating": venue.get("rating", 0),
                "price_level": price,
                "estimated_cost": price * 10,
                "duration_hours": 2,
                "distance_meters": location.get("distance", 0)
            })

    return all_venues[:limit]


# ─────────────────────────────────────────
# Search Restaurants
# ─────────────────────────────────────────
def get_restaurants(city, limit=5):
    print(f"\nFetching restaurants in {city}")
    url = f"{BASE_URL}/venues/search"
    params = {
        **base_params(),
        "near": city,
        "categoryId": "4d4b7105d754a06374d81259",  # Food category
        "limit": limit
    }
    response = requests.get(url, params=params, timeout=15)
    print(f"Status: {response.status_code}")
    data = response.json()

    venues = data.get("response", {}).get("venues", [])
    print(f"Restaurants found: {len(venues)}")

    restaurants = []
    for venue in venues:
        location = venue.get("location", {})
        price = venue.get("price", {}).get("tier", 1)
        restaurants.append({
            "id": venue.get("id"),
            "name": venue.get("name", "Unknown Restaurant"),
            "address": location.get("formattedAddress", ["N/A"])[0],
            "city": location.get("city", city),
            "lat": location.get("lat"),
            "lon": location.get("lng"),
            "category": "Restaurant",
            "rating": venue.get("rating", 0),
            "price_level": price,
            "estimated_cost": price * 15,
            "duration_hours": 1.5,
            "distance_meters": location.get("distance", 0)
        })
    return restaurants


# ─────────────────────────────────────────
# Full Research for TripGenie Module 2
# ─────────────────────────────────────────
def research_destination(city, travel_style="cultural"):
    print(f"\n{'='*50}")
    print(f"Full research: {city} | Style: {travel_style}")
    print(f"{'='*50}")

    hotels = get_hotels(city, limit=5)
    attractions = get_tourist_attractions(city, travel_style, limit=10)
    restaurants = get_restaurants(city, limit=5)

    activities = (attractions + restaurants)[:12]

    return {
        "hotels": hotels,
        "activities": activities
    }


# ─────────────────────────────────────────
# Tests
# ─────────────────────────────────────────
if __name__ == "__main__":

    print("=" * 50)
    print("TEST 1: Hotels in Tokyo")
    print("=" * 50)
    hotels = get_hotels("Tokyo", limit=3)
    for h in hotels:
        print(h)

    print("\n" + "=" * 50)
    print("TEST 2: Cultural attractions in Tokyo")
    print("=" * 50)
    attractions = get_tourist_attractions("Tokyo", "cultural", limit=6)
    for a in attractions:
        print(a)

    print("\n" + "=" * 50)
    print("TEST 3: Restaurants in Tokyo")
    print("=" * 50)
    restaurants = get_restaurants("Tokyo", limit=3)
    for r in restaurants:
        print(r)

    print("\n" + "=" * 50)
    print("TEST 4: Full research for Istanbul")
    print("=" * 50)
    result = research_destination("Istanbul", "cultural")
    print(f"\nHotels: {len(result['hotels'])}")
    print(f"Activities: {len(result['activities'])}")
    for h in result["hotels"]:
        print("HOTEL:", h["name"],
              "| Rating:", h["rating"],
              "| Price/night: $", h["price_per_night"])
    for a in result["activities"]:
        print("ACTIVITY:", a["name"],
              "| Category:", a["category"],
              "| Rating:", a["rating"])











