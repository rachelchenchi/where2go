import Head from 'next/head';
import React, { useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import Link from "next/link";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const mapOptions = {
  streetViewControl: false,
};

const PlaceDisplay = ({ place, onDelete, onEdit, showButtons = true }) => {
  const [showMap, setShowMap] = useState(false);

  const center =
    place && place.coordinates
      ? {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      }
      : null;

  const toggleMap = () => setShowMap(!showMap);

  const getVisitFrequencyEmoji = () => {
    if (place.visitFrequency === "never")
      return { emoji: "⏱️", label: "Never visited" };
    if (place.visitFrequency === "1-3 times")
      return { emoji: "💗", label: "Visited 1-3 times" };
    return { emoji: "🔥", label: "Visited more than 3 times" };
  };

  const visitFreq = getVisitFrequencyEmoji();

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
      </Head>
      <div className="column is-one-quarter">
        <div className="card">
          <div className="card-image">
            <figure className="image is-1by1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {place.imageUrl && (
                <img
                  src={place.imageUrl}
                  alt={`Image of ${place.name}`}
                  style={{ width: 'auto', width: '100%', objectFit: 'cover' }}
                />
              )}
            </figure>
          </div>
          <div className="card-content">
            <div className="columns">
              <div className="column">
                <h2 className="title is-4">{place.name}</h2>
              </div>
              {showButtons &&
                <div className="column is-multiline is-flex is-justify-content-flex-end">
                  <span title="Edit" onClick={() => onEdit(place.id)} className="icon is-small is-clickable has-text-success" style={{ marginRight: '20px' }}>
                    <i className="fas fa-edit"></i>
                  </span>
                  <span title="Delete" onClick={() => onDelete(place.id)} className="icon is-small is-clickable has-text-danger">
                    <i className="fas fa-trash-alt"></i>
                  </span>
                </div>}
            </div>
            <div className="field is-grouped is-multiline">
              {place.tags.split(",").map((tag, index) => (
                <div className="control" key={index}>
                  <div className="tags has-addons">
                    <span className="tag is-info">{tag.trim()}</span>
                  </div>
                </div>
              ))}
            </div>
            {!place.name && <div>
              <p>Url: <a href={place.yelpUrl} target="_blank" rel="noopener noreferrer">{place.yelpUrl}</a></p>
            </div>}

            <div className="starability-result" data-rating={place.rating} style={{ marginBottom: '20px' }}>
              Rating: {place.rating}
            </div>
            <span title={visitFreq.label}>{place.visitFrequency} visited {visitFreq.emoji}</span>
            {/* <span title="Publish to Community" className="is-size-6">📢 Open to Public</span> */}
            {showButtons && (
              <p>open to public?
                <input
                  type="checkbox"
                  checked={place.publishToCommunity || false}
                  disabled={true}
                  style={{ marginLeft: "10px", width: "20px", height: "20px", accentColor: "#00BFFF" }}
                />
              </p>
            )}
          </div>
          {showButtons && place.name && (
            <footer className="card-footer">
              <p className="card-footer-item">
                <span>
                  View on{" "}
                  <a
                    href={place.yelpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="is-link"
                  >
                    Yelp
                  </a>
                </span>
              </p>
              {center && (
                <p
                  className="card-footer-item is-clickable"
                  title="Show Map"
                  onClick={toggleMap}
                >
                  Show Map
                </p>
              )}
            </footer>
          )}
          {showMap && (
            <div className="modal is-active">
              <div className="modal-background" onClick={toggleMap}></div>
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Map View</p>
                  <button
                    className="delete"
                    aria-label="close"
                    onClick={toggleMap}
                  ></button>
                </header>
                <section className="modal-card-body">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    options={mapOptions}
                  >
                    <MarkerF position={center} />
                  </GoogleMap>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceDisplay;