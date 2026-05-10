import os
from dotenv import load_dotenv

load_dotenv()


def get_mock_flights(destination: str, departure_date: str, return_date: str) -> list:
    city = destination.split(",")[0].strip()
    return [
        {
            "id": "f1",
            "airline": "Emirates",
            "airline_logo": "🇦🇪",
            "departure_city": "New York",
            "departure_code": "JFK",
            "arrival_city": city,
            "arrival_code": city[:3].upper(),
            "departure_time": f"{departure_date}T08:00:00",
            "arrival_time": f"{departure_date}T22:00:00",
            "duration": "14h 00m",
            "stops": "Non-stop",
            "price": 780.0,
            "currency": "USD",
            "class": "Economy",
            "seats_left": 12
        },
        {
            "id": "f2",
            "airline": "Qatar Airways",
            "airline_logo": "🇶🇦",
            "departure_city": "New York",
            "departure_code": "JFK",
            "arrival_city": city,
            "arrival_code": city[:3].upper(),
            "departure_time": f"{departure_date}T14:00:00",
            "arrival_time": f"{departure_date}T06:00:00",
            "duration": "16h 00m",
            "stops": "1 stop (DOH)",
            "price": 650.0,
            "currency": "USD",
            "class": "Economy",
            "seats_left": 5
        },
        {
            "id": "f3",
            "airline": "Turkish Airlines",
            "airline_logo": "🇹🇷",
            "departure_city": "New York",
            "departure_code": "JFK",
            "arrival_city": city,
            "arrival_code": city[:3].upper(),
            "departure_time": f"{departure_date}T21:00:00",
            "arrival_time": f"{departure_date}T17:00:00",
            "duration": "20h 00m",
            "stops": "1 stop (IST)",
            "price": 590.0,
            "currency": "USD",
            "class": "Economy",
            "seats_left": 8
        },
        {
            "id": "f4",
            "airline": "Lufthansa",
            "airline_logo": "🇩🇪",
            "departure_city": "New York",
            "departure_code": "JFK",
            "arrival_city": city,
            "arrival_code": city[:3].upper(),
            "departure_time": f"{departure_date}T18:30:00",
            "arrival_time": f"{departure_date}T12:00:00",
            "duration": "17h 30m",
            "stops": "1 stop (FRA)",
            "price": 710.0,
            "currency": "USD",
            "class": "Economy",
            "seats_left": 15
        },
        {
            "id": "f5",
            "airline": "British Airways",
            "airline_logo": "🇬🇧",
            "departure_city": "New York",
            "departure_code": "JFK",
            "arrival_city": city,
            "arrival_code": city[:3].upper(),
            "departure_time": f"{departure_date}T22:45:00",
            "arrival_time": f"{departure_date}T18:30:00",
            "duration": "19h 45m",
            "stops": "1 stop (LHR)",
            "price": 820.0,
            "currency": "USD",
            "class": "Economy",
            "seats_left": 3
        }
    ]


def get_mock_hotels(destination: str, check_in: str, check_out: str) -> list:
    city = destination.split(",")[0].strip()
    return [
        {
            "id": "h1",
            "name": f"Grand {city} Palace Hotel",
            "stars": 5,
            "address": f"1 Royal Avenue, {city}",
            "rating": 4.8,
            "reviews": 2341,
            "price_per_night": 220.0,
            "currency": "USD",
            "amenities": ["Pool", "Spa", "WiFi", "Gym", "Restaurant"],
            "check_in": check_in,
            "check_out": check_out,
            "image": "🏨"
        },
        {
            "id": "h2",
            "name": f"{city} Boutique Inn",
            "stars": 4,
            "address": f"45 Old Town Street, {city}",
            "rating": 4.5,
            "reviews": 876,
            "price_per_night": 135.0,
            "currency": "USD",
            "amenities": ["WiFi", "Breakfast", "Bar"],
            "check_in": check_in,
            "check_out": check_out,
            "image": "🏩"
        },
        {
            "id": "h3",
            "name": f"Budget Comfort {city}",
            "stars": 3,
            "address": f"88 City Center Road, {city}",
            "rating": 4.1,
            "reviews": 543,
            "price_per_night": 75.0,
            "currency": "USD",
            "amenities": ["WiFi", "AC", "24h Reception"],
            "check_in": check_in,
            "check_out": check_out,
            "image": "🏪"
        }
    ]


def get_mock_activities(destination: str, travel_style: str) -> list:
    city = destination.split(",")[0].strip()

    all_activities = [
        {
            "id": "a1",
            "name": f"{city} National Museum",
            "type": "museum",
            "icon": "🏛️",
            "address": f"Museum Square, {city}",
            "rating": 4.7,
            "reviews": 5420,
            "estimated_cost": 15,
            "duration_hours": 3,
            "description": f"Explore the rich history and culture of {city} through fascinating exhibits.",
            "best_time": "Morning"
        },
        {
            "id": "a2",
            "name": f"{city} Central Park",
            "type": "park",
            "icon": "🌿",
            "address": f"Central District, {city}",
            "rating": 4.8,
            "reviews": 12300,
            "estimated_cost": 0,
            "duration_hours": 2,
            "description": "Beautiful park perfect for a morning walk or afternoon picnic.",
            "best_time": "Morning"
        },
        {
            "id": "a3",
            "name": f"Old Town {city}",
            "type": "landmark",
            "icon": "🏰",
            "address": f"Historic Quarter, {city}",
            "rating": 4.6,
            "reviews": 8900,
            "estimated_cost": 10,
            "duration_hours": 3,
            "description": f"Wander through the charming cobblestone streets of historic {city}.",
            "best_time": "Afternoon"
        },
        {
            "id": "a4",
            "name": f"{city} Art Gallery",
            "type": "art",
            "icon": "🎨",
            "address": f"Arts District, {city}",
            "rating": 4.4,
            "reviews": 3210,
            "estimated_cost": 20,
            "duration_hours": 2,
            "description": "Contemporary and classical art from local and international artists.",
            "best_time": "Afternoon"
        },
        {
            "id": "a5",
            "name": f"Grand Bazaar {city}",
            "type": "market",
            "icon": "🛍️",
            "address": f"Market District, {city}",
            "rating": 4.5,
            "reviews": 6700,
            "estimated_cost": 30,
            "duration_hours": 3,
            "description": "Shop for local crafts, spices, and souvenirs in this vibrant market.",
            "best_time": "Afternoon"
        },
        {
            "id": "a6",
            "name": f"{city} Waterfront",
            "type": "scenic",
            "icon": "🌊",
            "address": f"Harbor District, {city}",
            "rating": 4.9,
            "reviews": 9800,
            "estimated_cost": 0,
            "duration_hours": 2,
            "description": "Stunning waterfront views perfect for sunset walks.",
            "best_time": "Evening"
        },
        {
            "id": "a7",
            "name": f"Local Food Tour {city}",
            "type": "food",
            "icon": "🍜",
            "address": f"Food District, {city}",
            "rating": 4.9,
            "reviews": 2100,
            "estimated_cost": 45,
            "duration_hours": 3,
            "description": "Taste the authentic local cuisine with a guided food tour.",
            "best_time": "Evening"
        },
        {
            "id": "a8",
            "name": f"{city} Night Market",
            "type": "market",
            "icon": "🌙",
            "address": f"Night Bazaar Lane, {city}",
            "rating": 4.5,
            "reviews": 4500,
            "estimated_cost": 20,
            "duration_hours": 2,
            "description": "Experience the vibrant nightlife and street food scene.",
            "best_time": "Evening"
        },
        {
            "id": "a9",
            "name": f"Sunrise Viewpoint {city}",
            "type": "scenic",
            "icon": "🌅",
            "address": f"Hilltop, {city}",
            "rating": 4.7,
            "reviews": 3300,
            "estimated_cost": 5,
            "duration_hours": 2,
            "description": "Breathtaking panoramic view of the city at sunrise.",
            "best_time": "Morning"
        },
        {
            "id": "a10",
            "name": f"{city} Botanical Garden",
            "type": "garden",
            "icon": "🌸",
            "address": f"Garden Road, {city}",
            "rating": 4.4,
            "reviews": 2800,
            "estimated_cost": 10,
            "duration_hours": 2,
            "description": "Thousands of plant species from around the world.",
            "best_time": "Morning"
        }
    ]

    return all_activities


async def research_travel(preferences: dict) -> dict:
    destination = preferences.get("destination", "Paris, France")
    departure_date = preferences.get("departure_date", "2026-06-01")
    return_date = preferences.get("return_date", "2026-06-08")
    travel_style = preferences.get("travel_style", "cultural")

    flights = get_mock_flights(destination, departure_date, return_date)
    hotels = get_mock_hotels(destination, departure_date, return_date)
    activities = get_mock_activities(destination, travel_style)

    return {
        "flights": flights,
        "hotels": hotels,
        "activities": activities,
        "destination": destination,
        "departure_date": departure_date,
        "return_date": return_date
    }