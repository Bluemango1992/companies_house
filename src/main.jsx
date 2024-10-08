import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS here
import './leafletIcons'; // Import leaflet icon configuratio
import './input.css'; // Import the input CSS here
import { Analytics } from '@vercel/analytics/react';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
