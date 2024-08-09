import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Button from './Button';
import { renderToStaticMarkup } from 'react-dom/server';

function MarkerClusterGroup({ companies }) {
  const map = useMap();
  const groupRef = useRef(null);

  useEffect(() => {
    groupRef.current = L.markerClusterGroup();
    map.addLayer(groupRef.current);

    return () => {
      map.removeLayer(groupRef.current);
    };
  }, [map]);

  useEffect(() => {
    groupRef.current.clearLayers();
    companies.forEach((company) => {
      // Use the separate Latitude and Longitude fields
      const marker = L.marker([company.Latitude, company.Longitude]);

      const popupContent = renderToStaticMarkup(
        <div>
          <b>{company.CompanyName}</b><br />
          {company.Address}<br />
          Score: {company.TotalScore}
        </div>
      );
      marker.bindPopup(popupContent);

      groupRef.current.addLayer(marker);
    });
  }, [companies]);

  return null;
}

const MapComponent = () => {

  const mapRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const center = [51.509894, -2.580489];

  const fetchCompanies = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (!bounds) {
        console.error('Map bounds not available');
        return;
      }
      
      const northWest = bounds.getNorthWest();
      const southEast = bounds.getSouthEast();
  
      console.log('Exact Bounds:', northWest, southEast);
  
      fetch(
        `http://localhost:5000/companies?northWestLat=${northWest.lat}&northWestLng=${northWest.lng}&southEastLat=${southEast.lat}&southEastLng=${southEast.lng}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched companies:', data);
          setCompanies(data);
        })
        .catch((error) => console.error('Error fetching data:', error));
    } else {
      console.error('Map reference not available');
    }
  };

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup companies={companies} />
      </MapContainer>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <Button onClick={fetchCompanies}>Search Area</Button>
      </div>
    </div>
  );
};

export default MapComponent;
