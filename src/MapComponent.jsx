import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { renderToStaticMarkup } from "react-dom/server";
import Button from "./Button";
import FABButton from "./FABButton";
import Toast from "./Toast";
import BuyMeACoffeeButton from "./DonateButton";

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
      if (company.lat !== undefined && company.lng !== undefined) {
        const marker = L.marker([company.lat, company.lng]);

        const popupContent = renderToStaticMarkup(
          <div>
            <b>{company.name}</b>
            <br />
            {company.address.line_1}, {company.address.line_2}
            <br />
            {company.address.locality}, {company.address.postal_code}
            <br />
            Company Number: {company.company_number}
            <br />
            <a
              href={`https://find-and-update.company-information.service.gov.uk/company/${company.company_number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Company Info
            </a>
          </div>
        );
        marker.bindPopup(popupContent);

        groupRef.current.addLayer(marker);
      } else {
        console.warn("Invalid LatLng for company:", company);
      }
    });
  }, [companies]);

  return null;
}

const MapComponent = () => {
  const mapRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const center = [51.509894, -2.580489];

  // State for showing the toast
  const [showToast, setShowToast] = useState(true); // Initially show toast

  // Function to close the toast
  const handleCloseToast = () => {
    setShowToast(false);
  };

  // Automatically hide the toast after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const fetchCompanies = () => {
    const API_URL = import.meta.env.DEV
      ? import.meta.env.VITE_API_URL_DEVELOPMENT
      : import.meta.env.VITE_API_URL_PRODUCTION;
    
    // Log API_URL to check what value is being used
    console.log("Using API_URL:", API_URL);
  
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (!bounds) {
        console.error("Map bounds not available");
        return;
      }
  
      const northWest = bounds.getNorthWest();
      const southEast = bounds.getSouthEast();
  
      console.log("Exact Bounds:", northWest, southEast);
  
      fetch(
        `${API_URL}/companies?northWestLat=${northWest.lat}&northWestLng=${northWest.lng}&southEastLat=${southEast.lat}&southEastLng=${southEast.lng}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const filteredCompanies = data.filter((company) => {
            return (
              company.lat <= northWest.lat &&
              company.lat >= southEast.lat &&
              company.lng >= northWest.lng &&
              company.lng <= southEast.lng
            );
          });
  
          console.log("Filtered companies within bounds:", filteredCompanies);
          setCompanies(filteredCompanies);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      console.error("Map reference not available");
    }
  };  

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup companies={companies} />
      </MapContainer>
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "42px",
          zIndex: 1000,
        }}
      >
        <FABButton />
      </div>
      <div
        style={{ position: "absolute", top: "5%", left: "5%", zIndex: 1000 }}
      >
        <Toast
          message="Welcome! This page helps you filter the best companies in the UK, offering valuable information for lead generation, finding contacts, and potential suppliers. These companies are among the top performers in terms of financial strength, ensuring you access to high-quality business opportunities."
          show={showToast} // Control toast visibility
          onClose={handleCloseToast} // Handle toast close
        />
      </div>
      <BuyMeACoffeeButton />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Button onClick={fetchCompanies} />
      </div>
    </div>
  );
};

export default MapComponent;