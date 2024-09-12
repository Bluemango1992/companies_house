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
import "./MapComponent.css";

// Fix Leaflet's icon path issue for production
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

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
  const [isLoading, setIsLoading] = useState(false);
  const center = [51.509894, -2.580489];
  const [showToast, setShowToast] = useState(true);

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
    setIsLoading(true); // Set loading to true when starting the fetch
    const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000';    
  
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (!bounds) {
        console.error("Map bounds not available");
        setIsLoading(false); // Clear loading state if there's an error
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
          setIsLoading(false); // Clear loading state when done
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("Response status:", error.response?.status);
          console.error("Response text:", error.response?.text());
          setIsLoading(false);
        });
    } else {
      console.error("Map reference not available");
      setIsLoading(false); // Clear loading state if there's an error
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
          show={showToast}
          onClose={handleCloseToast}
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
        <Button onClick={fetchCompanies} disabled={isLoading} />
      </div>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2000,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="spinner"></div>
          <p style={{ marginTop: "10px" }}>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;