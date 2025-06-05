import random
import requests
from geopy.distance import geodesic
import argparse
DANGER_ZONE_BIN_URL = "https://api.jsonbin.io/v3/b/681f9a628960c979a596dbc0"
SAFE_ZONE_BIN_URL = "https://api.jsonbin.io/v3/b/682ccdac8a456b7966a2151d"
HEADERS = {
    "X-Master-Key": '<YOUR_API_KEY>',
    "Content-Type": "application/json"
}

NUM_DANGER_POINTS = 10
DANGER_RADIUS_KM = 2
SAFE_ZONE_MIN_DIST_KM = 3

def generate_random_location(base_lat, base_lng, radius_km):
    """Generate a random point within radius_km around (base_lat, base_lng)"""
    radius_deg = radius_km / 111 
    delta_lat = random.uniform(-radius_deg, radius_deg)
    delta_lng = random.uniform(-radius_deg, radius_deg)
    return (base_lat + delta_lat, base_lng + delta_lng)

def is_far_from_danger(point, danger_coords, min_distance_km):
    """Check if point is at least min_distance_km away from all danger zone coordinates"""
    return all(geodesic(point, tuple(coord)).km >= min_distance_km for coord in danger_coords)

def generate_danger_zone(base_location):
    base_lat, base_lng = base_location
    coords = [
        generate_random_location(base_lat, base_lng, DANGER_RADIUS_KM)
        for _ in range(NUM_DANGER_POINTS)
    ]
    
    coords = [[round(lat, 7), round(lng, 7)] for lat, lng in coords]
    return coords

def generate_safe_zone(base_location, danger_coords):
    base_lat, base_lng = base_location

    for _ in range(100):
        candidate = generate_random_location(base_lat, base_lng, SAFE_ZONE_MIN_DIST_KM)
        if is_far_from_danger(candidate, danger_coords, SAFE_ZONE_MIN_DIST_KM):
            return {"lat": round(candidate[0], 7), "lng": round(candidate[1], 7)}

    
    return {
        "lat": round(base_lat + SAFE_ZONE_MIN_DIST_KM / 111, 7),
        "lng": round(base_lng + SAFE_ZONE_MIN_DIST_KM / 111, 7)
    }

def update_danger_zone_bin(danger_coords):
   
    zone_data = [
        {
            "id": "zone1",
            "coordinates": danger_coords,
            "description": "Blocked road"
        }
    ]
    try:
        resp = requests.put(DANGER_ZONE_BIN_URL, headers=HEADERS, json=zone_data)
        resp.raise_for_status()
        print("Updated danger zone bin successfully.")
    except Exception as e:
        print("Failed to update danger zone bin:", e)

def update_safe_zone_bin(safe_location):
    safe_data = {
        "safe_location": safe_location
    }
    try:
        resp = requests.put(SAFE_ZONE_BIN_URL, headers=HEADERS, json=safe_data)
        resp.raise_for_status()
        print("Updated safe zone bin successfully.")
    except Exception as e:
        print("Failed to update safe zone bin:", e)

if __name__ == "__main__":
    # Your base location to generate zones around 
    parser = argparse.ArgumentParser(description="Generate danger and safe zones based on base location.")
    parser.add_argument("--lat", type=float, required=True, help="Base latitude")
    parser.add_argument("--lng", type=float, required=True, help="Base longitude")
    args = parser.parse_args()
    base_location = (args.lat, args.lng)
    danger_coords = generate_danger_zone(base_location)
    safe_location = generate_safe_zone(base_location, danger_coords)

    print("Danger zone coordinates:", danger_coords)
    print("Safe zone location:", safe_location)

    update_danger_zone_bin(danger_coords)
    update_safe_zone_bin(safe_location)
