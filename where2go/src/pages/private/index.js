import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddPlaceModal from '../../components/PopUp/AddPlace';
import EditPlaceModal from '../../components/PopUp/EditPlace';
import PlaceDisplay from '../../components/places/PlaceDisplay';
import * as db from '../../database';
import { useRouter } from 'next/router';

const Private = ({}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [places, setPlaces] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editPlace, setEditPlace] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
            if (authenticatedUser) {
                console.log("User is signed in");
                setUser(authenticatedUser);
                fetchPlaces(authenticatedUser.uid);
            } else {
                console.log("No user signed in");
                alert("You have to sign in first");
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const fetchPlaces = async (userId) => {
        const fetchedPlaces = await db.getUserPlaces(userId);
        setPlaces(fetchedPlaces);
    };

    const handlePlaceAdded = (newplace) => {
        setPlaces((prevPlaces) => [...prevPlaces, newplace]);
    };

    const handleDeletePlace = async (placeId) => {
        try {
            await db.deletePlace(placeId);
            setPlaces((prevPlaces) => prevPlaces.filter((allplace) => allplace.id !== placeId));
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

    const handleEditPlace = (place) => {
        setEditPlace(place);
        setIsEditModalOpen(true);
    };

    const handlePlaceUpdated = (placeId, updatedData) => {
        setPlaces((prevPlaces) => prevPlaces.map((place) => {
            return place.id === placeId ? { ...place, ...updatedData } : place;
        }));
    };



    return (
        <>
            <Head>
                <title>Private Space</title>
                <link rel="icon" href="/hands-up.png" />
            </Head>

            <div className="container">
                <h1 style={{ marginTop: "20px", display: "flex", justifyContent: "center" }} className="title">Private Space</h1>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <button
                        className="button is-info is-large"
                        onClick={() => setIsModalOpen(true)}
                    >
                        +
                    </button>
                    <h2 className="subtitle" style={{ marginLeft: "10px", fontWeight: "bold" }} >
                        Add a new place!
                    </h2>
                </div>
                <div>
                    <AddPlaceModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onPlaceAdded={handlePlaceAdded}
                    /></div>
                <div>
                    {isEditModalOpen && (
                        <EditPlaceModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            place={editPlace}
                            onPlaceUpdated={handlePlaceUpdated}
                        />
                    )}
                </div>
            </div >
            <div className="places-container">
                {places.map((place, index) => (
                    <PlaceDisplay key={index} className="place-display" place={place} onDelete={handleDeletePlace} onEdit={() => handleEditPlace(place)} />
                ))}
            </div>


        </>
    );
};

export default Private;
