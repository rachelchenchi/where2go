const PlaceDisplay = ({ place }) => {
    return (
        <div className="place-card">
            <h2>{place.name}</h2>
            <p>Yelp URL: <a href={place.yelpUrl} target="_blank" rel="noopener noreferrer">{place.yelpUrl}</a></p> {/* Yelp链接 */}
            <p>Tags: {place.tags}</p>
            <p>Rating: {place.rating}</p>
        </div>
    );
};

export default PlaceDisplay;
