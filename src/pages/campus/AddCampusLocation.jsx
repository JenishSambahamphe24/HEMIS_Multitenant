import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckBox } from "@mui/icons-material";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const campusId = config.VITE_CAMPUSID;

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const AddCampusLocation = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);
        setSelectedLocation(newLocation);
      },
      (error) => {
        console.error("Error getting current location:", error);
        setError(
          "Could not get your current location. Using default location instead."
        );
      },
      { enableHighAccuracy: true }
    );

    mapInstanceRef.current = L.map(mapRef.current).setView(
      [currentLocation.lat, currentLocation.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
      draggable: true,
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      markerRef.current.setLatLng([lat, lng]);
      setSelectedLocation({ lat, lng });
    });

    markerRef.current.on("dragend", () => {
      const position = markerRef.current.getLatLng();
      setSelectedLocation({ lat: position.lat, lng: position.lng });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && currentLocation) {
      mapInstanceRef.current.setView(
        [currentLocation.lat, currentLocation.lng],
        13
      );

      if (markerRef.current) {
        markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      }
    }
  }, [currentLocation]);

  const saveLocation = async () => {
    if (!selectedLocation) return;

    setIsSaving(true);

    try {
      const config = getAuthConfigSafe()
      const query = new URLSearchParams({
        CampusId: campusId,
        Latitude: selectedLocation.lat,
        Longitude: selectedLocation.lng,
      }).toString();
      const url = `${backendUrl}/Campus/UpdateLongitude?${query}`;
      await axios.patch(url, null, config);
      toast.success("Location Successfully Updated");
    } catch (error) {
      console.error("Error saving location:", error);
    } finally {
      setIsSaving(false);
    }
  };


  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div style={{ marginTop: "0rem" }}>
      <h1 className="text-lg">
        Location Map
      </h1>
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      )}
      <div className="leaflet-location-container" style={{ display: "flex" }}>
        <div
          ref={mapRef}
          className="map-container"
          style={{
            height: "400px",
            width: "60%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 0,
          }}
        />

        {selectedLocation && (
          <div
            className="location-details"
            style={{ marginBottom: "20px", marginLeft: "2rem" }}
          >
            <Typography sx={{ color: blue[700], fontWeight: "bold" }}>
              Instructions:
            </Typography>
            <ol
              type="1"
              style={{
                paddingLeft: "1.5rem",
                margin: 0,
                listStyleType: "decimal",
              }}
            >
              <li>
                The map shows your current location (Please make sure you are
                inside the campus Premises)
              </li>
              <li>Click anywhere on the map to set a new location</li>
              <li>You can also drag the marker to adjust the location</li>
              <li>Click "Save Location" to save the coordinates</li>
            </ol>

            <Typography
              variant="body1"
              sx={{ color: blue[700], textDecoration: "underline" }}
            >
              Your Current Location
            </Typography>
            <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
            <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
            <FormControlLabel
              // sx={{ display: "block" }}
              control={<Checkbox onChange={handleCheckboxChange} />}
              label="Are you sure you are in the Campus Premises(के तपाई हाल क्याम्पसभित्र हुनुहुन्छ )?"
            />
            {isChecked ? (
              <Button
                className="save-button"
                onClick={saveLocation}
                size="small"
                disabled={isSaving}
                style={{
                  marginTop: "5px",
                  padding: "8px 16px",
                  backgroundColor: blue[700],
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Location"}
              </Button>
            ) : (
              ""
            )}
          </div>
        )}

        {/* <div className="instructions">
         */}
      </div>
    </div>
  );
};

export default AddCampusLocation;
