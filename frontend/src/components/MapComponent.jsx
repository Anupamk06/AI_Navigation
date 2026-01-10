import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import crowdIconImg from '../assets/icons/avoid-crowds.png';
import constructionIconImg from '../assets/icons/under-construction.png';
import warningIconImg from '../assets/icons/warning.png';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to update map view when props change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MapComponent = ({ startCoords, endCoords, obstacles = [], nearbyHazards = [] }) => {
  // Default to a central location (e.g., London) if no coords provided, 
  // but in this app we simulated relative coords.
  // Let's assume startCoords and endCoords are [lat, lng] arrays. 
  // If our simulation uses simple x,y, we might need to map them to real geocoords 
  // or just use an arbitrary safe area for the demo.
  
  // For this demo, let's map our simulation "locations" to real lat/lngs in a city like New York or London.
  // Start: Central Parkish [40.785091, -73.968285]
  // We'll treat the simulation offsets as small lat/lng deltas.

  // Center of India
  const baseLat = 20.5937;
  const baseLng = 78.9629;

  const getLatLng = (loc) => {
    if (!loc) return [baseLat, baseLng];
    // Simple hash to deterministic pseudo-random offset if it's a string name
    if (typeof loc === 'string') {
        let hash = 0;
        for (let i = 0; i < loc.length; i++) hash = loc.charCodeAt(i) + ((hash << 5) - hash);
        const latOffset = (hash % 100) / 10000;
        const lngOffset = (hash % 100) / 10000;
        return [baseLat + latOffset, baseLng + lngOffset];
    }
    return loc; // Assume it's already [lat, lng] if not string
  };

  const startPos = getLatLng(startCoords);
  const endPos = getLatLng(endCoords);

  // Simple straight line for "route" in this MVP map
  const routePolyline = [startPos, endPos];

  const getMarkerIcon = (type) => {
    let iconUrl = warningIconImg;
    let iconSize = [32, 32]; // Adjust size for custom icons
    
    // Choose icon based on type
    switch(type) {
      case 'Crowd':
        iconUrl = crowdIconImg;
        break;
      case 'Construction':
        iconUrl = constructionIconImg;
        break;
      case 'Obstacle':
        iconUrl = warningIconImg;
        break;
      default:
        iconUrl = warningIconImg;
    }

    return L.icon({
      iconUrl,
      // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Optional: disable shadow for clean look or find matching one
      iconSize: iconSize, 
      iconAnchor: [16, 32], // Center bottom anchor
      popupAnchor: [0, -32],
    });
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
      {/* Zoom level adjusted to show 1km radius better when hazards are present */}
      <MapContainer center={startPos} zoom={nearbyHazards.length > 0 ? 15 : 5} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={startPos} zoom={nearbyHazards.length > 0 ? 15 : 5} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={startPos}>
          <Popup>Start Location</Popup>
        </Marker>
        {endCoords && (
            <Marker position={endPos}>
            <Popup>Destination</Popup>
            </Marker>
        )}
        
        {/* Render obstacles if any map-able obstacles exist */}
        {obstacles.map((obs, idx) => (
           // Random offset for demo obstacles near the route
           <Marker key={idx} position={[startPos[0] + (endPos[0]-startPos[0])*0.5 + (Math.random()-0.5)*0.005, startPos[1] + (endPos[1]-startPos[1])*0.5 + (Math.random()-0.5)*0.005]}>
             <Popup>{obs.message}</Popup>
           </Marker>
        ))}

        {/* Nearby Hazards Scan - 1km Radius */}
        {nearbyHazards && nearbyHazards.length > 0 && (
          <>
            <Circle 
              center={startPos} 
              radius={1000} // 1km
              pathOptions={{ fillColor: 'red', color: 'red', opacity: 0.1, fillOpacity: 0.05 }} 
            />
            {nearbyHazards.map((hazard, hIdx) => (
              <Marker 
                key={`haz-${hIdx}`} 
                position={[
                  startPos[0] + hazard.latOffset, 
                  startPos[1] + hazard.lngOffset
                ]}
                icon={getMarkerIcon(hazard.type)}
              >
                <Popup>
                  <strong>{hazard.type}</strong><br/>
                  {hazard.details}
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {endCoords && <Polyline positions={routePolyline} color="hsl(var(--primary))" weight={5} opacity={0.7} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
