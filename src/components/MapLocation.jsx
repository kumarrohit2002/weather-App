import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapUpdater = ({ coord }) => {
  const map = useMap();

  useEffect(() => {
    if (coord?.lat && coord?.lon) {
      map.setView([coord.lat, coord.lon], map.getZoom());
    }
  }, [coord, map]);

  return null;
};

const MapLocation = ({ weather }) => {
  const coord = weather?.coord;

  useEffect(() => {
    console.log("Weather refresh");
  }, [weather]);

  return (
    <div>
      <h1 className="text-3xl">MAP Location</h1>
      {coord?.lat && coord?.lon && (
        <div className="mt-6 w-full h-[300px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer center={[coord.lat, coord.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <MapUpdater coord={coord} /> {/* This updates the map's center */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coord.lat, coord.lon]}>
              <Popup>{`${weather.name}: ${weather.main.temp}°C`}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default MapLocation;
