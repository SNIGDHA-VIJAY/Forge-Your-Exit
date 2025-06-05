from flask import Flask, request, jsonify
import uuid
from geopy.distance import geodesic
import numpy as np
import openrouteservice
from openrouteservice import convert
import requests
from shapely.geometry import Point, mapping
from shapely.ops import unary_union
import os
import json
from flask_cors import CORS
import subprocess
from time import sleep
app = Flask(__name__)
CORS(app)
client = openrouteservice.Client(key='<YOUR_API_KEY>')

alerts = []

@app.route('/submit-alert', methods=['POST', 'OPTIONS'])
def submit_alert():
    if request.method == 'OPTIONS':

        return '', 200
    data = request.json
    data['id'] = str(uuid.uuid4())
    alerts.append(data)
    return jsonify({"message": "Alert received", "id": data['id']}), 200

@app.route('/alerts', methods=['GET', 'OPTIONS'])
def get_alerts():
    return jsonify(alerts), 200

def is_near_danger(point, danger_zones, radius_m=300):
    for dz in danger_zones:
        if geodesic(point, dz).meters < radius_m:
            return True
    return False


def generate_avoid_polygon(danger_zones, radius_deg=0.002):
    buffered = [Point(lng, lat).buffer(radius_deg) for lat, lng in danger_zones]
    unioned = unary_union(buffered)

    if unioned.geom_type == "Polygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [[[list(coord) for coord in unioned.exterior.coords]]]
        }
    elif unioned.geom_type == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [
                [[list(coord) for coord in poly.exterior.coords]] for poly in unioned.geoms
            ]
        }
    else:
        return {"type": "MultiPolygon", "coordinates": []}

@app.route('/get-evacuation-route', methods=['POST','OPTIONS'])
def get_route():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json
    print(data)
    start = [data['start_lng'], data['start_lat']]
    subprocess.run(["python", "update.py", "--lat", str(start[1]), "--lng", str(start[0])])
    end = [data['end_lng'], data['end_lat']]
    danger_zones = data['danger_zones']

    avoid_geojson = generate_avoid_polygon(danger_zones)

    headers = {
        "Authorization": '<YOUR_API_KEY>',
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [start, end],
        "format": "geojson",
        "options": {
            "avoid_polygons": avoid_geojson
        }
    }

    response = requests.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        headers=headers,
        json=body
    )

    if response.ok:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Routing failed", "details": response.text}), 400

DATA_FILE = 'volunteers.json'
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@app.route('/register-volunteer', methods=['POST'])
def register_volunteer():
    data = request.get_json()

    required_fields = ['name', 'email', 'phone']
    if not all(field in data and str(data[field]).strip() for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:

        response = requests.get(f"{JSONBIN_URL}/latest", headers=HEADERS)
        response.raise_for_status()
        existing_data = response.json()
        volunteers = existing_data['record'].get('volunteers', [])
        volunteers.append(data)
        updated_data = { "volunteers": volunteers }
        put_response = requests.put(JSONBIN_URL, headers=HEADERS, data=json.dumps(updated_data))
        put_response.raise_for_status()

        return jsonify({'message': 'Volunteer registered successfully'}), 200

    except requests.RequestException as e:
        print("JSONBin error:", e)
        return jsonify({'error': 'Failed to store volunteer data'}), 500


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0",port=5000)
