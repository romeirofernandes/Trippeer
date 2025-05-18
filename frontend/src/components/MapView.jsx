import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers using URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for user and checkpoint
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const checkpointIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapView = ({ userLocation, checkpointLocation }) => {

  if (!userLocation)
    return (
      <div className="h-[400px] rounded-lg overflow-hidden bg-[#111111] flex items-center justify-center text-[#9cadce]">
        Loading map...
      </div>
    );

  // Line style matching theme
  const lineOptions = {
    color: "#9cadce",
    weight: 2,
    opacity: 0.8,
    dashArray: "5, 10", // Creates dashed line effect
  };

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-dotted border-[#232323]">
      <MapContainer
        center={userLocation}
        zoom={13}
        className="h-full w-full"
        style={{ background: "#111111" }}
      >
        {/* Dark theme map tiles */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />

        <Marker position={userLocation} icon={userIcon} />
        {checkpointLocation && (
          <>
            <Marker position={checkpointLocation} icon={checkpointIcon} />
            <Polyline
              positions={[userLocation, checkpointLocation]}
              pathOptions={lineOptions}
            />
          </>
        )}
        <RecenterAutomatically userLocation={userLocation} />
      </MapContainer>
    </div>
  );
};

const RecenterAutomatically = ({ userLocation }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(userLocation);
  }, [userLocation, map]);
  return null;
};

export default MapView;
