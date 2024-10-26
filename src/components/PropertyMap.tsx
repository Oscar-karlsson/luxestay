import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';


// Custom house icon setup
const houseIcon = new L.Icon({
    iconUrl: '/house-icon.png', // Adjust path as needed
    iconSize: [32, 32],         // Size of the icon
    iconAnchor: [16, 32],       // Anchor point of the icon (bottom center)
    popupAnchor: [0, -32],      // Popup anchor point
});

const PropertyMap = ({ latitude, longitude, title }) => {
    const position = [latitude, longitude];

    return (
        <MapContainer center={position} zoom={10} style={{ height: '400px', width: '100%' }}>
<TileLayer
    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
/>
<Marker position={position} icon={houseIcon} interactive={false}>
                <Popup>
                    <div>
                        <h4>{title}</h4>
                        <p>Property Location</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default PropertyMap;
