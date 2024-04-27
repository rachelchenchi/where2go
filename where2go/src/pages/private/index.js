import Head from 'next/head';
import { useEffect, useState } from 'react';
import AddPlaceModal from '../../components/PopUp/AddPlace';
import PlaceDisplay from '../../components/PlaceDisplay';
import * as db from '../../database';

const Private = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchPlaces = async () => {
            const fetchedPlaces = await db.getPlaces();
            setPlaces(fetchedPlaces);
        };
        fetchPlaces();
    }, []);

    return (
        <>
            <Head>
                <title>Private Space</title>
            </Head>

            <div className="container">
                <h1 className="title">Private Space</h1>

                <button
                    className="button is-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
                <AddPlaceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div >
            <div>
                {places.map((place, index) => (
                    <PlaceDisplay key={index} place={place} />
                ))}
            </div>


        </>
    );
};

export default Private;
