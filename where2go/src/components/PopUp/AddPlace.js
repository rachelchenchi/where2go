import { useState } from 'react';
import { createPortal } from 'react-dom';
import * as db from '../../database';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../../firebase'

const AddPlaceModal = ({ isOpen, onClose, onPlaceAdded }) => {
    const [yelpUrl, setYelpUrl] = useState('');
    const [tags, setTags] = useState('');
    const [rating, setRating] = useState('');
    const [visitFrequency, setVisitFrequency] = useState('never');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentUser = getAuth(firebaseApp).currentUser;
            const userId = currentUser ? currentUser.uid : null;

            await db.createPlace({
                yelpUrl,
                tags,
                rating,
                visitFrequency,
                owner: userId,
            });
            if (onPlaceAdded) {
                onPlaceAdded({ yelpUrl, tags, rating, visitFrequency, owner: userId });
            }
            console.log('Place created successfully');
            onClose();
        } catch (error) {
            console.error('Error creating place:', error);
        }
        // onClose();
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Add a Place</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Yelp's URL</label>
                        <input
                            type="text"
                            placeholder="Enter the Yelp URL"
                            value={yelpUrl}
                            onChange={(e) => setYelpUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Tags</label>
                        <input
                            type="text"
                            placeholder="Enter tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Rating</label>
                        <input
                            type="number"
                            placeholder="Enter rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>How many times have you visited this place?</label>
                        <select
                            value={visitFrequency}
                            onChange={(e) => setVisitFrequency(e.target.value)}
                        >
                            <option value="never">Never</option>
                            <option value="0-2 times">0-2 times</option>
                            <option value="more than 2 times">More than 2 times</option>
                        </select>
                    </div>
                    <button class="button is-primary" type="submit">Add</button>
                </form>
            </div >
        </div >,
        document.body
    );
};

export default AddPlaceModal;

