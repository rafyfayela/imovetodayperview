import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import villaIconImg from '../../assets/villa.png';
import workplaceIconImg from '../../assets/workplace.png';
import houseIconImg from '../../assets/house.png';
import apartmentIconImg from '../../assets/apartement.png';
import schoolIconImg from '../../assets/school.png';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons
const villaIcon = new L.Icon({
  iconUrl: villaIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const houseIcon = new L.Icon({
  iconUrl: houseIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const apartmentIcon = new L.Icon({
  iconUrl: apartmentIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const workplaceIcon = new L.Icon({
  iconUrl: workplaceIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const schoolIcon = new L.Icon({
  iconUrl: schoolIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Helper function to get the appropriate icon based on property type
const getPropertyIcon = (type) => {
  switch (type) {
    case 'villa':
      return villaIcon;
    case 'house':
      return houseIcon;
    case 'apartment':
      return apartmentIcon;
    default:
      return houseIcon; // Default icon
  }
};

// Recenter helper
const RecenterMap = ({ location }) => {
  const map = useMap();
  if (location)
    map.setView([location.latitude, location.longitude], map.getZoom(), { animate: true });
  return null;
};

const MapComponent = ({
  pickLocationMode,
  setPickLocationMode,
  selectedLocation,
  setSelectedLocation,
  userWorkplaceLocation,
  properties,
  schools,
  radiusKm: parentRadiusKm = 5,
  setRadiusKm,
}) => {
  const [localRadius, setLocalRadius] = useState(parentRadiusKm);
  const [validProperties, setValidProperties] = useState([]);
  const [validSchools, setValidSchools] = useState([]);

  // Update valid properties and schools when props change
  useEffect(() => {
    if (Array.isArray(properties)) {
      setValidProperties(properties);
    } else {
      setValidProperties([]);
    }

    if (Array.isArray(schools)) {
      setValidSchools(schools);
    } else {
      setValidSchools([]);
    }
  }, [properties, schools]);

  // Update parent when slider changes
  const handleRadiusChange = (e) => {
    const value = Number(e.target.value);
    setLocalRadius(value);
    setRadiusKm?.(value);
  };

  // Click to pick location
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        if (!pickLocationMode) return;
        const { lat, lng } = e.latlng;
        setSelectedLocation({ latitude: lat, longitude: lng });
        setPickLocationMode(false);
      },
    });
    return null;
  };

  const workplacePosition = selectedLocation || userWorkplaceLocation;
  const initialCenter = workplacePosition
    ? [workplacePosition.latitude, workplacePosition.longitude]
    : [25.276987, 55.296249];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {workplacePosition && (
          <Marker
            position={[workplacePosition.latitude, workplacePosition.longitude]}
            icon={workplaceIcon}
          >
            <Popup>Workplace</Popup>
          </Marker>
        )}

        {/* Render property markers */}
        {validProperties.map((property) => {
          try {
            const location = JSON.parse(property.location);
            const propertyIcon = getPropertyIcon(property.type);

            return (
              <Marker
                key={property.id}
                position={[location.latitude, location.longitude]}
                icon={propertyIcon}
              >
                <Popup>
                  <div>
                    <h3>{property.name}</h3>
                    <p>Rating: {property.rating}</p>
                    <button
                      onClick={() => window.open(`/app/properties/${property.id}`, '_blank')}
                      style={{
                        marginTop: '5px',
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          } catch (e) {
            console.error('Error parsing property location:', e, property);
            return null;
          }
        })}

        {/* Render school markers */}
        {validSchools.map((school) => {
          try {
            const location = JSON.parse(school.geolocation);

            return (
              <Marker
                key={school.id}
                position={[location.latitude, location.longitude]}
                icon={schoolIcon}
              >
                <Popup>
                  <div>
                    <h3>{school.name}</h3>
                    <p>Fees: {school.fees_range}</p>
                  </div>
                </Popup>
              </Marker>
            );
          } catch (e) {
            console.error('Error parsing school location:', e, school);
            return null;
          }
        })}

        {workplacePosition && localRadius > 0 && (
          <Circle
            center={[workplacePosition.latitude, workplacePosition.longitude]}
            radius={localRadius * 1000}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1, weight: 1 }}
          />
        )}

        {workplacePosition && <RecenterMap location={workplacePosition} />}
        <LocationPicker />
      </MapContainer>

      {/* Slider overlay */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          right: 10,
          padding: '5px',
          borderRadius: '8px',
          zIndex: 400,
          width: '180px',
        }}
      >
        <label style={{ display: 'block', marginBottom: '2px', fontWeight: '400', color: '#333' }}>
          Range: {localRadius} km
        </label>
        <input
          type="range"
          min="1"
          max="200"
          value={localRadius}
          onChange={handleRadiusChange}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default MapComponent;
