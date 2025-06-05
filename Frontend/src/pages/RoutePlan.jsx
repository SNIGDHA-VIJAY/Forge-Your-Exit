import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '@/assets/leaflet/marker-icon.png';
import markerIcon2x from '@/assets/leaflet/marker-icon-2x.png';
import markerShadow from '@/assets/leaflet/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RoutePlan = () => {
  const location = useLocation();
  const form = location.state?.form;

  const [routeCoords, setRouteCoords] = useState([]);
  const [dangerZones, setDangerZones] = useState([]);
  const [safeSpot, setSafeSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState(null);
  const [showVolunteerInfo, setShowVolunteerInfo] = useState(true);


  const userPos = [form.latitude, form.longitude];

  useEffect(() => {
    const fetchDangerZones = async () => {
      const res = await fetch("https://api.jsonbin.io/v3/b/681f9a628960c979a596dbc0/latest", {
        headers: {
          "X-Master-Key": '<YOUR_API_KEY>'
        }
      });
      const data = await res.json();
      const coords = data.record[0].coordinates;
      return coords.map(([lat, lng]) => [lat, lng]);
    };

    const fetchSafeSpot = async () => {
      const res = await fetch("https://api.jsonbin.io/v3/b/682ccdac8a456b7966a2151d/latest", {
        headers: {
          "X-Master-Key": '<YOUR_API_KEY>'
        }
      });
      const data = await res.json();
      
      return data.record.safe_location; 
    };

    const fetchRoute = async (dz, spot) => {
      console.log(spot[0]);
      const res = await fetch('https://epbackend-7qjc.onrender.com/get-evacuation-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_lat: userPos[0],
          start_lng: userPos[1],
          end_lat: spot['lat'],
          end_lng: spot['lng'],
          danger_zones: dz,
        }),
      });

      const data = await res.json();
      console.log(data);
      const coords = data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      
      return coords;
    };

    const init = async () => {
      try {
        const [dz, spot] = await Promise.all([fetchDangerZones(), fetchSafeSpot()]);
        setDangerZones(dz);
        setSafeSpot(spot);
        //console.log(spot);
        const route = await fetchRoute(dz, spot);
        setRouteCoords(route);
      } catch (err) {
        console.error('Initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };
      const stored = localStorage.getItem("assignedVolunteer");
        if (stored) {
          setVolunteer(JSON.parse(stored));
        }

    init();
  }, []);

  return (
    <div>
      <div className="route-header">🛡️ Safe Route Planning</div>
      <p className="route-subtext">
        Follow the green path to reach the nearest safe zone while avoiding danger areas.
      </p>

      {loading ? (
          <div style={{ position: 'relative', height: '100vh' }}>
    <MapContainer
      center={userPos}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>

    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>
        Loading evacuation route...
      </p>
      <div className="spinner" />
    </div>
  </div>
) : (
        
        <div className="map-wrapper">
          <MapContainer center={userPos} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={userPos}>
              <Popup>You are here</Popup>
            </Marker>

            {safeSpot && (
              <Marker position={safeSpot}>
                <Popup>Safe Location</Popup>
              </Marker>
            )}

            {dangerZones.map((dz, i) => (
              <Circle
                key={i}
                center={dz}
                radius={300}
                pathOptions={{ color: 'red', fillOpacity: 0.4 }}
              >
                <Popup>Danger Zone 🚨</Popup>
              </Circle>
            ))}

            {routeCoords.length > 0 && (
              <Polyline
                positions={routeCoords}
                pathOptions={{ color: 'green', weight: 4 }}
              />
            )}
          </MapContainer>
        </div> 
    )}
    {volunteer && (
  <div
    style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: showVolunteerInfo ? '12px 15px' : '8px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      maxWidth: showVolunteerInfo ? '250px' : '40px',
      textAlign: showVolunteerInfo ? 'left' : 'center',
    }}
    onClick={() => setShowVolunteerInfo(!showVolunteerInfo)}
    title={showVolunteerInfo ? 'Click to minimize' : 'Click to show volunteer info'}
  >
    {showVolunteerInfo ? (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px',align:'center' }}>👤</div>
        <div><strong>Name:</strong> {volunteer.name}</div>
        <div><strong>Email:</strong> {volunteer.email}</div>
        <div><strong>Phone:</strong> {volunteer.phone}</div>
      </div>
    ) : (
      <div style={{ fontSize: '20px' }}>👤</div>
    )}
  </div>
)}

    </div>
  );
};

export default RoutePlan;
