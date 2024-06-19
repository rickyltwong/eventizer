'use client';

import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import { Marker } from 'react-leaflet/Marker';

import { Icon } from 'leaflet';
import { IEvent } from '@/types/event';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  events: IEvent[];
  center: [number, number];
  zoom: number;
  isUserLocation: boolean;
}

const redMarker = new Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowSize: [41, 41],
});

const blueMarker = new Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowSize: [41, 41],
});

const SetMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  map.invalidateSize();
  map.setView(center);

  return null;
};

export default function MapView({
  events,
  center,
  zoom,
  isUserLocation,
}: MapViewProps) {
  const [leafletLatLng, setLeafletLatLng] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setLeafletLatLng(() => leaflet.latLng);
    };
    loadLeaflet();
  }, []);

  if (!leafletLatLng) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100vh', width: '100wh' }}>
      <SetMap center={center} />
      <TileLayer
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}"
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      />
      {isUserLocation && (
        <Marker position={center} icon={blueMarker}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {events.map((event) => (
        <Marker
          icon={redMarker}
          key={event.eventName}
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
}
