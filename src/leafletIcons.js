// src/leafletIcons.js
import L from 'leaflet';
import customMarkerIcon from './assets/custom-marker.png';

const CustomIcon = new L.Icon({
  iconUrl: customMarkerIcon,
  iconRetinaUrl: customMarkerIcon,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41] // size of the shadow
});

export { CustomIcon };
