

# 🛡️ Evacuation Route Helper 🚨

A real-time, AI-enhanced web application designed to assist civilians during emergencies like missile attacks, natural disasters, and chemical leaks. The system generates optimized evacuation routes that avoid dynamically marked danger zones, supports volunteer coordination, and enables public alert submission.

> 🔗 Built using **Flask**, **ReactJS**, **OpenRouteService API**, and **JSONBin** for scalable, cloud-based disaster response.

> 🔗 https://evacuationroute-planner.onrender.com
---

## 📌 Features

- 🔴 **Crowdsourced Danger Alerts**  
  Civilians can report danger zones instantly via a simple form.

- 🗺️ **Smart Evacuation Routing**  
  Dynamically avoids unsafe areas using geofenced danger zones and OpenRouteService's `avoid_polygons`.

- 🧑‍🤝‍🧑 **Volunteer Registration System**  
  Volunteers can register their availability, location, and skills to assist during crises.

- 📍 **Live Map Visualization**  
  Visual feedback of alerts and routes via Leaflet.js for improved situational awareness.

---

## 🚀 Tech Stack

| Layer       | Tech Used                         |
|-------------|-----------------------------------|
| Frontend    | ReactJS, Leaflet.js               |
| Backend     | Flask (Python)                    |
| Routing     | OpenRouteService API              |
| Geospatial  | Shapely, Geopy                    |
| Database    | JSONBin (NoSQL Cloud Storage)     |
| Hosting     | Render / Heroku (optional)        |

---

## 🧠 Core Workflow

1. **User sends alert**:  
   Coordinates of the threat are submitted to the backend.

2. **Alert storage**:  
   Flask stores these in memory or optionally persists them.

3. **Route request**:  
   A user sends start and end points → system queries OpenRouteService with `avoid_polygons`.

4. **Response**:  
   A danger-free route is rendered on the frontend map.

---

## 🧪 API Endpoints

| Endpoint             | Description                          |
|----------------------|--------------------------------------|
| `/submit-alert`      | Accepts new danger alert coordinates |
| `/alerts`            | Returns all current alerts           |
| `/get-evacuation-route` | Generates safe route avoiding danger |
| `/register-volunteer` | Submits volunteer info to JSONBin   |

---

## 💻 Run Locally

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📷 Screenshots
### Home Page               
![image](https://github.com/user-attachments/assets/e25e33b1-d8c5-4d9b-9485-a09940664d2a)

### Alert Submission       
![{04D4D674-138E-4D32-B5B5-08D18DE0F5CE}](https://github.com/user-attachments/assets/52e72201-7eaa-42b8-af98-914257af4cd1)

### Safe Route
![image](https://github.com/user-attachments/assets/0dd8587e-eb91-48f2-af56-e90f2c8d4822)

### Volunteer Registeration
![image](https://github.com/user-attachments/assets/880fe21a-b9eb-441a-bd76-fcd04aff077d)

---

## 📚 References

* [OpenRouteService API Docs](https://openrouteservice.org/dev/#/)
* [Flask Web Framework](https://flask.palletsprojects.com/)
* [JSONBin Cloud Storage](https://jsonbin.io/)
* [Geopy Documentation](https://geopy.readthedocs.io/)
* [Shapely Docs](https://shapely.readthedocs.io/)

---

## 🙋‍♀️ Authors

* Snigdha Vijay
* Prince Jain

---

## ✅ Future Enhancements

* Add authentication with role-based access (admins, volunteers).
* Integrate alert-level severity (high/medium/low).
* Enable mobile push notifications.
* Deploy full stack on secure cloud infrastructure.

---

## 📜 License

This project is licensed under the MIT License — feel free to fork, contribute, and enhance.

---


