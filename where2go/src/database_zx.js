import firebaseApp from "./firebase";
import { getFirestore, query, where, collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, increment } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore(firebaseApp);


// ----------------------
// User-related functions
// ----------------------

export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("User added with ID: ", docRef.id);
    return docRef.id; // Useful for further operations such as creating user-specific data
  } catch (e) {
    console.error("Error adding user: ", e);
  }
};

export const getUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
      return docSnap.data(); // Returns user data
    } else {
      console.log("No such user!");
      return null; // Indicates no user found
    }
  } catch (e) {
    console.error("Error retrieving user: ", e);
  }
};


//--------------------------
// Add, Create, Get function
//--------------------------


// Fetch user's Group Space (past groups/events)
export const getGroups = async (userId) => {
  try {
    const groupsRef = query(collection(db, "groupSpaces"), where("members", "array-contains", userId));
    const snapshot = await getDocs(groupsRef);
    const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Retrieved groups:", groups);
    return groups;
  } catch (e) {
    console.error("Error fetching groups:", e);
  }
};


// Create a new group/event in Group Space
export const createGroup = async (groupData) => {
  try {
    const docRef = await addDoc(collection(db, "groupSpaces"), groupData);
    console.log("Group created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error creating group:", e);
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



// -----------------
// Delete functions:
// -----------------

// Delete a place from Private Space
export const deletePlaceFromPrivate = async (userId, placeId) => {
    try {
      const placeRef = doc(db, "privateSpaces", userId, "places", placeId);
      await deleteDoc(placeRef);
      console.log("Place deleted successfully from Private Space");
    } catch (e) {
      console.error("Error deleting place from Private Space:", e);
    }
  };


// Delete a group/event
export const deleteGroup = async (groupId) => {
    try {
      const groupRef = doc(db, "groupSpaces", groupId);
      await deleteDoc(groupRef);
      console.log("Group/Event deleted successfully");
      // Consider removing related sub-collections or documents if necessary
    } catch (e) {
      console.error("Error deleting group/event:", e);
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
  