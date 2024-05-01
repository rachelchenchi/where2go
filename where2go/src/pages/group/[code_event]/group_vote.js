import { useEffect, useState } from 'react';
import PickaTime from '@/components/groupVote/pickTime'
import Dropdown from '@/components/groupVote/dropdown';
import * as db from '@/database'
import { useRouter } from 'next/router';

const GroupVote = () => {
    const router = useRouter();
    const { code_event } = router.query;
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');

    // fetch function to get saved places from the database
    useEffect(() => {
        const fetchPlaces = async () => {
            // Replace this with your actual data fetching logic from the database
            const data = await db.getPlacesByGroup(code_event);
            setPlaces(data);
        };

        if (code_event) {
            fetchPlaces();
        }
    }, [code_event]);

    // useEffect(() => {
    //     const fetchPlaces = async () => {
    //         if (user) {
    //             const fetchedPlaces = await db.getUserPlaces(user.uid);
    //             setPlaces(fetchedPlaces);
    //         } else {
    //             setPlaces([]);
    //         }
    //     };
    //     fetchPlaces();
    // }, [user]);

    const handleVote = async (place) => {
        // Implement voting logic here
        await db.voteForPlace(code_event, place);
        console.log(`Voted for place: ${place}`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div>
                <h1>Welcome Group {code_event}</h1>
                <div>
                    <Dropdown
                        options={places}
                        value={selectedPlace.name}
                        onChange={(selected) => setSelectedPlace(selected)}
                        placeholder="Select a place"
                    />

                    <input type="text" placeholder="Add a place" />
                    <PickaTime />
                </div>
            </div>
            <div>
                <h2>Pick the place to vote:</h2>
                <ul>
                    {places.map((place, index) => (
                        <li key={index}>
                            {place.name} - <button onClick={() => handleVote(place)}>Vote</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GroupVote;
