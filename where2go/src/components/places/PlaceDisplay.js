import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import styles from '../../styles/PlaceDisplay.module.css';
import React, { useState } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const mapOptions = {
    streetViewControl: false
};


const PlaceDisplay = ({ place, onDelete, onEdit, showButtons = true }) => {
    const [showMap, setShowMap] = useState(false);

    const center = place && place.coordinates ? {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude
    } : null;

    const toggleMap = () => setShowMap(!showMap);

    return (
        <div className={styles.placeCard}>
            <h2>{place.name}</h2>
            {place.imageUrl && <img src={place.imageUrl} alt={`Image of ${place.name}`} style={{ width: '100%', height: '400px', marginBottom: '10px' }} />}
            <p>Yelp URL: <a href={place.yelpUrl} target="_blank" rel="noopener noreferrer">{place.yelpUrl}</a></p>
            <p>Tags:<span style={{
                backgroundColor: "rgb(230, 240, 250)",
                marginLeft: "10px",
                padding: "5px 20px",
                borderRadius: "15px",
                display: "inline-block"
            }}> {place.tags}</span></p>
            <div style={{ marginLeft: "20px" }} className="starability-result" data-rating={place.rating} aria-label={`Rating: ${place.rating} out of 5.`}>
                Rating: {place.rating}
            </div>
            <p>Visit Frequency: <i>{place.visitFrequency}</i></p>
            {showButtons && (
                <p>Publish to Community:
                    <input
                        type="checkbox"
                        checked={place.publishToCommunity || false}
                        disabled={true}
                        style={{ marginLeft: "10px", width: "20px", height: "20px", accentColor: "#00BFFF" }}
                    />
                </p>
            )}
            {showButtons && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{ width: '100px', margin: "5px 10px", marginBottom: "10px" }} class="button is-danger" onClick={() => onDelete(place.id)}>Delete</button>
                    <button style={{ width: '100px', margin: "5px 10px", marginBottom: "10px" }} class="button is-primary" onClick={() => onEdit(place.id)}>Edit</button>
                    {center && <button style={{ width: '100px', margin: "5px 10px", marginBottom: "10px" }} class="button is-info" onClick={toggleMap}>Show Map</button>}
                </div>
            )}
            {
                showMap && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className={styles.closeButton} onClick={toggleMap}>&times;</span>

                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={12}
                                options={mapOptions}
                            >
                                <MarkerF position={center} />
                            </GoogleMap>

                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default PlaceDisplay;
