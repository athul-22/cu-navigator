import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import './App.css'; // Optional: for custom styling

const locations = [
  {
    title: "Architecture block",
    image: "https://cdn-icons-png.freepik.com/512/5088/5088218.png",
    coordinates: { lat: 12.860478, lng: 77.438711 }
  },
  {
    title: "Devadhan hALL",
    image: "https://cdn-icons-png.freepik.com/512/5088/5088218.png",
    coordinates: { lat: 12.860448, lng: 77.439469 }
  }
];

const Routing = ({ userLocation, selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !selectedLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(selectedLocation.coordinates.lat, selectedLocation.coordinates.lng)
      ],
      routeWhileDragging: true,
      createMarker: function (i, waypoint, n) {
        let icon = new L.Icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        if (i === 0) {
          icon = new L.Icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        }

        return L.marker(waypoint.latLng, { icon });
      }
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [userLocation, selectedLocation, map]);

  return null;
};

const AnimatedMarker = ({ position }) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [nextPosition, setNextPosition] = useState(null);

  useMapEvent('move', () => {
    if (nextPosition) {
      setCurrentPosition(nextPosition);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextPosition) {
        setCurrentPosition(nextPosition);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPosition]);

  useEffect(() => {
    if (position) {
      setNextPosition(position);
    }
  }, [position]);

  return (
    <Marker position={currentPosition} icon={new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })}>
      <Popup>Your Moving Location</Popup>
    </Marker>
  );
};

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const userLocationIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png', // Red icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="app">
      {showMap && (
        <div className="map-container">
          <button className="close-button" onClick={() => setShowMap(false)}>Close</button>
          <MapContainer center={[12.860448, 77.439469]} zoom={17} style={{ height: "80vh", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation && (
              <Marker position={userLocation} icon={userLocationIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {locations.map((location, index) => (
              <Marker key={index} position={[location.coordinates.lat, location.coordinates.lng]}>
                <Popup>
                  <img src="https://cdn-icons-png.freepik.com/512/12727/12727781.png" alt={location.title} style={{ width: "100px", height: "100px" }} />
                  <br />
                  {location.title}
                </Popup>
              </Marker>
            ))}
            {userLocation && selectedLocation && (
              <Routing userLocation={userLocation} selectedLocation={selectedLocation} />
            )}
            {userLocation && <AnimatedMarker position={userLocation} />}
          </MapContainer>
        </div>
      )}
      <div className="location-list">
        {locations.map((location, index) => (
          <div key={index} onClick={() => { setSelectedLocation(location); setShowMap(true); }} className="location-item">
            <img src={location.image} alt={location.title} style={{ width: "50px", height: "50px" }} />
            <span>{location.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
