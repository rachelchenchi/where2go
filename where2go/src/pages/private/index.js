import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddPlaceModal from '../../components/PopUp/AddPlace';
import PlaceDisplay from '../../components/PlaceDisplay';
import * as db from '../../database';
import { useRouter } from 'next/router';

const Private = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [places, setPlaces] = useState([]);
    const router = useRouter();

    useEffect(() => {
        console.log("User state changed");
        if (!user) {
            alert("You have to sign in first");
            router.push('/login');
        }
    }, []);


    useEffect(() => {
        const fetchPlaces = async () => {
            if (user) {
                const fetchedPlaces = await db.getUserPlaces(user.uid);
                setPlaces(fetchedPlaces);
            } else {
                setPlaces([]);
            }
        };
        fetchPlaces();
    }, [user]);

    const handlePlaceAdded = (newplace) => {
        setPlaces((prevPlaces) => [...prevPlaces, newplace]);
    };

    const handleDeletePlace = async (place) => {
        try {
            await db.deletePlace(place);
            setPlaces((prevPlaces) => prevPlaces.filter((allplace) => allplace.id !== place.id));
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

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
                    onPlaceAdded={handlePlaceAdded}
                />
            </div >
            <div>
                {places.map((place, index) => (
                    <PlaceDisplay key={index} place={place} onDelete={handleDeletePlace} />
                ))}
            </div>


        </>
    );
};

export default Private;
