import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
const LeafletMap = ({ userLocation }) => {
  const position = userLocation || { lat: 12.9716, lng: 77.5946 }; 

  

  return (
    <MapContainer center={position} zoom={13}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
