import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SmallLeaflet = ({ location }) => {
  console.log('raw location prop:', location);

  let loc = location;

  if (typeof location === 'string') {
    try {
      loc = JSON.parse(location);
    } catch (err) {
      console.error('Failed to parse location:', err);
      return <p>Location information not available</p>;
    }
  }

  if (!loc || loc.latitude == null || loc.longitude == null) {
    return <p>Location information not available</p>;
  }

  const position = [loc.latitude, loc.longitude];

  return (
    <MapContainer
      key={`${loc.latitude}-${loc.longitude}`}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      zoomControl={false} // removes + and - buttons
      attributionControl={false}
      style={{ height: '200px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
      <Marker position={position}>
        <Popup>
          Selected Location: <br /> Lat: {loc.latitude}, Lng: {loc.longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default SmallLeaflet;
