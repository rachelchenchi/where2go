import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as db from '../../database';
import styles from '../../styles/Modal.module.css';

const EditPlaceModal = ({ isOpen, onClose, onPlaceUpdated, place }) => {
    const [yelpUrl, setYelpUrl] = useState('');
    const [tags, setTags] = useState('');
    const [rating, setRating] = useState('');
    const [visitFrequency, setVisitFrequency] = useState('never');
    const yelpUrlRegex = /https?:\/\/www\.yelp\.com\/biz\/([a-z0-9-]+)/i;

    const getYelpBusinessId = (url) => {
        const match = url.match(yelpUrlRegex);
        return match ? match[1] : null;
    };

    const fetchYelpDetails = async (businessId) => {
        const response = await fetch(`/api/yelp/${businessId}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch Yelp business details');
        }
    };

    useEffect(() => {
        if (place) {
            setYelpUrl(place.yelpUrl || '');
            setTags(place.tags || '');
            setRating(place.rating || '');
            setVisitFrequency(place.visitFrequency || 'never');
        }
    }, [place]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const businessId = getYelpBusinessId(yelpUrl);

            if (businessId) {
                const businessDetails = await fetchYelpDetails(businessId);
                console.log('Business details:', businessDetails);
                const updatedData = {
                    yelpUrl,
                    tags,
                    rating,
                    visitFrequency,
                    // ...businessDetails,
                    name: businessDetails.name,
                    imageUrl: businessDetails.image_url,
                    coordinates: businessDetails.coordinates,
                }

                await db.updatePlace(place.id, updatedData);

                if (onPlaceUpdated) {
                    onPlaceUpdated(place.id, updatedData);
                }
            } else {
                console.log('Invalid Yelp URL, but its your choice:(');
                const updatedData = {
                    yelpUrl,
                    tags,
                    rating,
                    visitFrequency,
                }
                await db.updatePlace(place.id, updatedData);
                if (onPlaceUpdated) {
                    onPlaceUpdated(place.id, updatedData);
                }
                console.log('Place created successfully');
                onClose();
            }

            onClose();
        } catch (error) {
            console.error('Error updating place:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2>Edit Place</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label>Yelp's URL</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Enter Yelp's URL"
                            value={yelpUrl}
                            onChange={(e) => setYelpUrl(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Tags</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Enter tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                    <div className={styles.field} style={{ marginBottom: '0px' }}>
                        <label>Rating</label>
                        {/* <input
                            className={styles.input}
                            type="number"
                            placeholder="Enter rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        /> */}
                        <div className={styles.starability}>
                            <div className="starability-heartbeat">
                                <input
                                    type="radio"
                                    id="rate-1"
                                    name="rating"
                                    value="1"
                                    checked={rating === "1"}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                                <label for="rate-1" title="1 star">1 star</label>

                                <input
                                    type="radio"
                                    id="rate-2"
                                    name="rating"
                                    value="2"
                                    checked={rating === "2"}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                                <label for="rate-2" title="2 stars">2 stars</label>

                                <input
                                    type="radio"
                                    id="rate-3"
                                    name="rating"
                                    value="3"
                                    checked={rating === "3"}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                                <label for="rate-3" title="3 stars">3 stars</label>

                                <input
                                    type="radio"
                                    id="rate-4"
                                    name="rating"
                                    value="4"
                                    checked={rating === "4"}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                                <label for="rate-4" title="4 stars">4 stars</label>

                                <input
                                    type="radio"
                                    id="rate-5"
                                    name="rating"
                                    value="5"
                                    checked={rating === "5"}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                                <label for="rate-5" title="5 stars">5 stars</label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.field} style={{ marginTop: '0px' }}>
                        <label>How many times have you visited this place?</label>
                        <select
                            className={styles.select}
                            value={visitFrequency}
                            onChange={(e) => setVisitFrequency(e.target.value)}
                        >
                            <option value="never">Never</option>
                            <option value="0-2 times">0-2 times</option>
                            <option value="more than 2 times">More than 2 times</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <button className={styles.button} type="submit">Submit</button>
                    </div>
                </form>
            </div >
        </div >,
        document.body
    );
};

export default EditPlaceModal; 
