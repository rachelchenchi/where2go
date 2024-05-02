// import { useEffect, useState } from 'react';
// import PickaTime from '@/components/groupVote/pickTime'
// import Dropdown from '@/components/groupVote/dropdown';
// import * as db from '@/database'
// import { useRouter } from 'next/router';


// const GroupVote = ({ user }) => {
//     const router = useRouter();
//     const { code_event } = router.query;
//     const [places, setPlaces] = useState([]);

//     useEffect(() => {
//         if (!user || !user.uid) {
//             router.push('/login');
//             return;
//         }

//         const fetchPlaces = async () => {
//             const fetchedPlaces = await db.getSavedPlaces(user.uid);
//             setPlaces(fetchedPlaces);
//         };

//         fetchPlaces();
//     }, [user, router]);


//     const handleVote = async (place) => {
//         // Implement voting logic here
//         await db.voteForPlace(code_event, place);
//         console.log(`Voted for place: ${place}`);
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
//             <div>
//                 <h1>Welcome Group {code_event}</h1>
//                 <div>
//                     <Dropdown
//                         options={places}
//                         value={selectedPlace}
//                         onChange={(e) => setSelectedPlace(e.target.value)}
//                         placeholder="Select a place"
//                     />

//                     <input type="text" placeholder="Add a place" />
//                     <PickaTime />
//                 </div>
//             </div>
//             <div>
//                 <h2>Pick the place to vote:</h2>
//                 <ul>
//                     {places.map((place) => (
//                         <li key={place.id}>
//                             {place.name} - <button onClick={() => handleVote(place)}>Vote</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default GroupVote;


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const EventPage = () => {
  const router = useRouter();
  const { code_event } = router.query;

  return (
    <div>
      <h1>Event: {code_event}</h1>
      <p>Details about event {code_event}...</p>
    </div>
  );
};

export default EventPage;
