import { useState } from 'react';
import { createPortal } from 'react-dom';
import * as db from '../../database';

const AddPlaceModal = ({ isOpen, onClose }) => {
    const [yelpUrl, setYelpUrl] = useState('');
    const [tags, setTags] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await db.createPlace({
                yelpUrl,
                tags,
                rating,
            });

            console.log('Place created successfully');
            onClose();
        } catch (error) {
            console.error('Error creating place:', error);
        }
        onClose();
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
                    <button type="submit">Add</button>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddPlaceModal; // 默认导出

