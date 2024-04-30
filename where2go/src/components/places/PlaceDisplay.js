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


const PlaceDisplay = ({ place, onDelete, onEdit }) => {
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
            <p>Tags: {place.tags}</p>
            <p>Rating: {place.rating}</p>
            <p>Visit Frequency: {place.visitFrequency}</p>
            <button style={{ margin: "5px 10px" }} class="button is-danger" onClick={() => onDelete(place.id)}>Delete</button>
            <button style={{ margin: "5px 10px" }} class="button is-primary" onClick={() => onEdit(place.id)}>Edit</button>
            {center && <button style={{ margin: "5px 10px" }} class="button is-info" onClick={toggleMap}>Show Map</button>}
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
