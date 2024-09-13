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
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

function MarkerClusterGroup({ companies }) {
  const map = useMap();
  const groupRef = useRef(L.markerClusterGroup());

  useEffect(() => {
    const group = groupRef.current;
    map.addLayer(group);

    return () => {
      map.removeLayer(group);
    };
  }, [map]);

  useEffect(() => {
    const group = groupRef.current;
    group.clearLayers();

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

        group.addLayer(marker);
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
  const [fetchError, setFetchError] = useState(null);
  const center = [51.509894, -2.580489];
  const [showToast, setShowToast] = useState(true);

  const API_URL =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PRODUCTION
      : import.meta.env.VITE_API_URL_DEVELOPMENT;

  // Close the toast after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch companies with a timeout using AbortController
  const fetchCompanies = async () => {
    setIsLoading(true);
    setFetchError(null);

    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (!bounds) {
        console.error("Map bounds not available");
        setIsLoading(false);
        return;
      }

      const northWest = bounds.getNorthWest();
      const southEast = bounds.getSouthEast();

      const apiUrl = `${API_URL}api/companies?northWestLat=${northWest.lat}&northWestLng=${northWest.lng}&southEastLat=${southEast.lat}&southEastLng=${southEast.lng}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

        const response = await fetch(apiUrl, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const filteredCompanies = data.filter(
          (company) =>
            company.lat <= northWest.lat &&
            company.lat >= southEast.lat &&
            company.lng >= northWest.lng &&
            company.lng <= southEast.lng
        );

        setCompanies(filteredCompanies);
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("Request timed out");
          setFetchError("Request timed out");
        } else {
          console.error("Error fetching data:", error);
          setFetchError("Failed to load companies: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Map reference not available");
      setFetchError("Map reference not available.");
      setIsLoading(false);
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
      <div className="fab-button-container">
        <FABButton />
      </div>
      <div className="toast-container">
        <Toast
          message="Welcome! This page helps you filter the best companies in the UK, offering valuable information for lead generation, finding contacts, and potential suppliers. These companies are among the top performers in terms of financial strength, ensuring you access to high-quality business opportunities."
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
      <BuyMeACoffeeButton />
      <div className="fetch-button-container">
        <Button onClick={fetchCompanies} disabled={isLoading} />
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {fetchError && (
        <div className="error-overlay">
          <div className="error-content">
            <p>{fetchError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
