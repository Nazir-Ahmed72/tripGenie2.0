import requests
import os
from dotenv import load_dotenv

load_dotenv()

AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
BASE_URL = "http://api.aviationstack.com/v1"


def get_real_time_flights(limit=10):
    url = f"{BASE_URL}/flights"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "limit": limit
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_flights_by_route(origin_iata, destination_iata, limit=5):
    url = f"{BASE_URL}/flights"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "dep_iata": origin_iata,
        "arr_iata": destination_iata,
        "limit": limit
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_flights_by_airline(airline_iata, limit=5):
    url = f"{BASE_URL}/flights"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "airline_iata": airline_iata,
        "limit": limit
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_flights_by_date(flight_date, limit=5):
    url = f"{BASE_URL}/flights"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "flight_date": flight_date,
        "limit": limit
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_airports(search=None, limit=10):
    url = f"{BASE_URL}/airports"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "limit": limit
    }
    if search:
        params["search"] = search
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_airlines(search=None, limit=10):
    url = f"{BASE_URL}/airlines"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "limit": limit
    }
    if search:
        params["search"] = search
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_routes(airline_iata=None, limit=10):
    url = f"{BASE_URL}/routes"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "limit": limit
    }
    if airline_iata:
        params["airline_iata"] = airline_iata
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def parse_flight_data(flight):
    return {
        "flight_number": flight.get("flight", {}).get("iata", "N/A"),
        "airline": flight.get("airline", {}).get("name", "N/A"),
        "airline_iata": flight.get("airline", {}).get("iata", "N/A"),
        "departure_airport": flight.get("departure", {}).get("airport", "N/A"),
        "departure_iata": flight.get("departure", {}).get("iata", "N/A"),
        "departure_time": flight.get("departure", {}).get("scheduled", "N/A"),
        "departure_terminal": flight.get("departure", {}).get("terminal", "N/A"),
        "arrival_airport": flight.get("arrival", {}).get("airport", "N/A"),
        "arrival_iata": flight.get("arrival", {}).get("iata", "N/A"),
        "arrival_time": flight.get("arrival", {}).get("scheduled", "N/A"),
        "arrival_terminal": flight.get("arrival", {}).get("terminal", "N/A"),
        "flight_status": flight.get("flight_status", "N/A"),
        "flight_date": flight.get("flight_date", "N/A")
    }


if __name__ == "__main__":

    print("=" * 50)
    print("TEST 1: Real-time flights")
    print("=" * 50)
    data = get_real_time_flights(limit=3)
    print(data)

    print("\n" + "=" * 50)
    print("TEST 2: Flights JFK to NRT")
    print("=" * 50)
    data = get_flights_by_route("JFK", "NRT", limit=3)
    print(data)

    print("\n" + "=" * 50)
    print("TEST 3: Emirates flights")
    print("=" * 50)
    data = get_flights_by_airline("EK", limit=3)
    print(data)

    print("\n" + "=" * 50)
    print("TEST 4: Airport search")
    print("=" * 50)
    data = get_airports(search="Tokyo", limit=3)
    print(data)

    print("\n" + "=" * 50)
    print("TEST 5: Airline search")
    print("=" * 50)
    data = get_airlines(search="Emirates", limit=2)
    print(data)