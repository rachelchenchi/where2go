import firebaseApp from "./firebase";
import { getFirestore, query, where, collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, increment } from "firebase/firestore";

// CS5356 TO-DO #0 Initialize Firestore
const db = getFirestore(firebaseApp);

// CS5356 TO-DO #1
export const createPost = async (post) => {
    // Create a Post object with 3 properties: username, name, and message
    const docRef = await addDoc(collection(db, "posts"), post);
    console.log("Document written with ID: ", docRef.id)
};

// CS5356 TO-DO #2
export const getAllPosts = async () => {
    // Get all the posts in your collection
    // Each object should have an id, username, name, and message
    const result = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        result.push({
            id: doc.id,
            // username: data.username,
            // name: data.name,
            // message: data.message
            ...doc.data()
        });
        console.log(`${doc.id} => ${doc.data()}`);
    });
    return result;
};

// CS5356 TO-DO #3
export const deletePost = async (post) => {
    // Delete a post in your database
    await deleteDoc(doc(db, "posts", post.id));
};

// CS5356 TO-DO #4
export const likePost = async (post) => {
    // Update a particular post and increment the like counter
    await updateDoc(doc(db, "posts", post.id), {
        likes: increment(1)
    });
    console.log(post.likes);


};


//WHERE2GO DATABASE FUNCTIONS
export const createPlace = async (place) => {
    // Create a Place object with 3 properties: yelpUrl, tags, and rating
    try {
        await addDoc(collection(db, 'places'), place);
        console.log('Place added to database');
    } catch (error) {
        console.error('Error adding place to database:', error);
    }
};

// export const getPlaces = async () => {
//     // Get all the places in your collection
//     // Each object should have an id, yelpUrl, tags, and rating
//     const result = [];
//     const querySnapshot = await getDocs(collection(db, 'places'));
//     querySnapshot.forEach((doc) => {
//         result.push({
//             id: doc.id,
//             ...doc.data()
//         });
//     });
//     return result;
// };

export const getUserPlaces = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to fetch places");
    }
    const placesCollection = collection(db, 'places');
    const userPlacesQuery = query(placesCollection, where('owner', '==', userId));
    const snapshot = await getDocs(userPlacesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deletePlace = async (placeId) => {
    // Delete a place in your database
    try {
        await deleteDoc(doc(db, 'places', placeId));
        console.log(`Place with ID ${placeId} deleted`);
    } catch (error) {
        console.error('Error deleting place:', error);
    }
};

export const updatePlace = async (placeId, updatedData) => {
    // Update a place in your database
    try {
        const placeRef = doc(db, 'places', placeId);
        await updateDoc(placeRef, updatedData);
        console.log(`Place with ID ${placeId} updated`);
    } catch (error) {
        console.error('Error updating place:', error);
    }
}

export const getCommunityPlaces = async () => {
    const placesCollection = collection(db, 'places');
    const communityPlacesQuery = query(placesCollection, where('publishToCommunity', '==', true));
    const snapshot = await getDocs(communityPlacesQuery);
    const allPlaces = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allPlaces.sort(() => 0.5 - Math.random()).slice(0, 3);
}



//////////////////////////
// group - vote functions
//////////////////////////

// Get saved places from private space
export const getSavedPlaces = async (userId) => {
  try {
      if (!userId) throw new Error("need a valid user ID");
      const placesRef = collection(db, 'users', userId, 'places');
      const querySnapshot = await getDocs(placesRef);
      return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));
  } catch (error) {
      console.error("Failed to fetch places:", error);
      return [];
  }
};



// Delete a place from Voting in a group/event
export const removePlaceFromVote = async (groupId, eventId, placeId) => {
    try {
      const eventRef = doc(db, "groupSpaces", groupId, "events", eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const updatedPlaces = eventSnap.data().votingPlaces.filter(place => place.id !== placeId);
        await updateDoc(eventRef, { votingPlaces: updatedPlaces });
        console.log("Place removed from voting successfully");
      } else {
        console.error("Event does not exist");
      }
    } catch (e) {
      console.error("Error removing place from voting:", e);
    }
  };


  // Update the vote
export const updateVote = async (groupId, eventId, placeId, voteChange) => {
    try {
      const eventRef = doc(db, "groupSpaces", groupId, "events", eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const updatedPlaces = eventSnap.data().votingPlaces.map(place => {
          if (place.id === placeId) {
            return { ...place, votes: place.votes + voteChange };
          }
          return place;
        });
        await updateDoc(eventRef, { votingPlaces: updatedPlaces });
        console.log("Vote updated successfully for place in event");
      } else {
        console.error("Event does not exist");
      }
    } catch (e) {
      console.error("Error updating votes:", e);
    }
  };  

// Update votes for a place in an event
export const updateVotes = async (groupId, eventId, placeId, incrementValue) => {
    try {
      const eventRef = doc(db, "groupSpaces", groupId, "events", eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const places = eventSnap.data().votingPlaces.map(place => {
          if (place.id === placeId) {
            return { ...place, votes: place.votes + incrementValue };
          }
          return place;
        });
        await updateDoc(eventRef, { votingPlaces: places });
        console.log("Votes updated for place in event.");
      } else {
        console.error("Event does not exist");
      }
    } catch (e) {
      console.error("Error updating votes:", e);
    }
  };

  // Add a place from Private Space to a Group/Event for voting
export const addPlaceToVote = async (groupId, eventId, placeId, userId) => {
    try {
      const placeRef = doc(db, "privateSpaces", userId, "places", placeId);
      const placeSnap = await getDoc(placeRef);
      if (placeSnap.exists()) {
        const eventRef = doc(db, "groupSpaces", groupId, "events", eventId);
        const placeData = { ...placeSnap.data(), votes: 0 };
        await updateDoc(eventRef, {
          votingPlaces: firebase.firestore.FieldValue.arrayUnion(placeData)
        });
        console.log("Place added to voting in event with ID: ", eventId);
      } else {
        console.error("Place does not exist in Private Space");
      }
    } catch (e) {
      console.error("Error adding place to voting:", e);
    }
  };