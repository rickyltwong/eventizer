import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { Marker } from 'react-leaflet/Marker';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { Event } from '@/types';

interface MapViewProps {
  events: Event[];
  center: LatLng;
  zoom: number;
}

const customIcon = new Icon({
  iconUrl:
    'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const MapView: React.FC<MapViewProps> = ({ events, center, zoom }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '55rem', width: '50%' }}>
      <TileLayer
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}"
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[center.lat, center.lng]} icon={customIcon}>
        <Popup>You are here</Popup>
      </Marker>
      {events.map((event) => (
        <Marker
          icon={customIcon}
          key={event._id}
          position={[
            event.eventAddress.latitude,
            event.eventAddress.longitude,
          ]}>
          <Popup>
            <strong>{event.eventName}</strong>
            <p>{event.eventDescription}</p>
            <p>{`${event.eventAddress.venueName}, ${event.eventAddress.addressLine1}, ${event.eventAddress.city}, ${event.eventAddress.state}`}</p>
            <p>Starts: {new Date(event.eventStartDateTime).toLocaleString()}</p>
            <p>Ends: {new Date(event.eventEndDateTime).toLocaleString()}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
