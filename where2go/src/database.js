import firebaseApp from "./firebase";

import {
  getFirestore,
  query,
  where,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

// CS5356 TO-DO #0 Initialize Firestore
const db = getFirestore(firebaseApp);

// CS5356 TO-DO #1
export const createPost = async (post) => {
  // Create a Post object with 3 properties: username, name, and message
  const docRef = await addDoc(collection(db, "posts"), post);
  console.log("Document written with ID: ", docRef.id);
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
      ...doc.data(),
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
    likes: increment(1),
  });
  console.log(post.likes);
};

//WHERE2GO DATABASE FUNCTIONS
export const createPlace = async (place) => {
  // Create a Place object with 3 properties: yelpUrl, tags, and rating
  try {
    await addDoc(collection(db, "places"), place);
    console.log("Place added to database");
  } catch (error) {
    console.error("Error adding place to database:", error);
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
  const placesCollection = collection(db, "places");
  const userPlacesQuery = query(placesCollection, where("owner", "==", userId));
  const snapshot = await getDocs(userPlacesQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deletePlace = async (placeId) => {
  // Delete a place in your database
  try {
    await deleteDoc(doc(db, "places", placeId));
    console.log(`Place with ID ${placeId} deleted`);
  } catch (error) {
    console.error("Error deleting place:", error);
  }
};

export const updatePlace = async (placeId, updatedData) => {
  // Update a place in your database
  try {
    const placeRef = doc(db, "places", placeId);
    await updateDoc(placeRef, updatedData);
    console.log(`Place with ID ${placeId} updated`);
  } catch (error) {
    console.error("Error updating place:", error);
  }
};

export const getCommunityPlaces = async () => {
  const placesCollection = collection(db, "places");
  const communityPlacesQuery = query(
    placesCollection,
    where("publishToCommunity", "==", true)
  );
  const snapshot = await getDocs(communityPlacesQuery);
  const allPlaces = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return allPlaces.sort(() => 0.5 - Math.random()).slice(0, 3);
};

///////////////////////////////
// group - event page functions
///////////////////////////////


export const addProposal = async (proposalData) => {
  try {
    const proposalsCollection = collection(db, "proposals");
    const docRef = await addDoc(proposalsCollection, proposalData);
    console.log("Proposal added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding proposal: ", error);
    throw new Error("Failed to add proposal");
  }
};


export const fetchProposalsByGroup = async (groupId) => {
  try {
    const proposalsCollection = collection(db, "proposals");
    const q = query(proposalsCollection, where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);
    const proposals = [];
    querySnapshot.forEach((doc) => {
      proposals.push({ id: doc.id, ...doc.data() });
    });
    return proposals;
  } catch (error) {
    console.error("Error fetching proposals: ", error);
    throw new Error("Failed to fetch proposals");
  }
};


export const deleteProposal = async (proposalId) => {
  try {
    const proposalRef = doc(db, "proposals", proposalId);
    await deleteDoc(proposalRef);
    console.log("Proposal deleted with ID: ", proposalId);
  } catch (error) {
    console.error("Error deleting proposal: ", error);
    throw new Error("Failed to delete proposal");
  }
};


export const submitVote = async (groupId, placeId, voterId) => {
  const votesCollection = collection(db, "votes");
  const newVote = {
    groupId,
    placeId,
    voterId,
    timestamp: new Date()  // Useful for tracking when votes were cast
  };
  await addDoc(votesCollection, newVote);
};


//--------------------------
// Create/Read/Update/Delete Group functionality
//--------------------------

// Create a Group object with 6 properties: groupName, startDate, endDate, members, createdAt
// member with 3 properties: userName, userId, role (owner/member)
export const createGroup = async (groupData) => {
  try {
    const docRef = await addDoc(collection(db, "groups"), groupData);
    console.log("Group created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error creating group:", e);
  }
};

// Fetch Group by groupId
export const getGroup = async (groupId) => {
  try {
    const docRef = doc(db, "groups", groupId); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Retrieved group with ID ${groupId}: `, docSnap.data());
      // Return the group data with its ID
      return { id: docSnap.id, ...docSnap.data() }; 
    } else {
      // Return null if the document does not exist
      console.log("No such group!");
      return null; 
    }
  } catch (e) {
    // Handle errors and possibly return null
    console.error(`Error fetching group with ID ${groupId}:`, e);
    return null; 
  }
};

// Fetch user's All Group Space (owned and joined)
export const getAllGroups = async (userId) => {
  try {
    const groupsRef = query(
      collection(db, "groups"),
      where("membersId", "array-contains", userId)
    );
    const snapshot = await getDocs(groupsRef);
    const groups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Retrieved groups:", groups);
    return groups;
  } catch (e) {
    console.error("Error fetching all groups:", e);
  }
};

// Fetch user's Owned Group Space (only owned)
export const getOwnedGroups = async (userId) => {
  try {
    const groupsRef = query(
      collection(db, "groups"),
      where("ownerId", "==", userId)
    );
    const snapshot = await getDocs(groupsRef);
    const groups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Retrieved groups:", groups);
    return groups;
  } catch (e) {
    console.error("Error fetching owned groups:", e);
  }
};

// Delete a group/event if it is owned by this user
export const deleteGroup = async (groupId) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    await deleteDoc(groupRef);
    console.log("Group/Event deleted successfully");
    // Consider removing related sub-collections or documents if necessary
  } catch (e) {
    console.error("Error deleting group/event:", e);
  }
};

// Update Group Member if it is owned by this user
export const updateGroup = async (groupId, updatedData) => {
  try {
    await updateDoc(doc(db, "groups", groupId), updatedData);
    console.log(`Group with ID ${groupId} updated`);
  } catch (e) {
    console.error("Error deleting member from group:", e);
  }
};

// Leave Group if user is a member of the group
export const leaveGroup = async (groupId, userId) => {
  console.log("GroupId:", groupId);  // Check if groupId is valid
  console.log("UserId:", userId);    // Check if userId is valid
  try {
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);
    
    if (groupDoc.exists()) {
      // Retrieve the current members and member IDs from the group document
      const { members, membersId } = groupDoc.data();

      // Filter out the leaving user from both arrays
      const updatedMembers = members.filter(member => member.userId !== userId);
      const updatedMembersId = membersId.filter(memberId => memberId !== userId);

      // Update the group's 'members' and 'membersId' fields in Firestore
      await updateDoc(groupRef, { members: updatedMembers, membersId: updatedMembersId });
      console.log(`User ${userId} removed from group with ID ${groupId}`);
    } else {
      console.log("No such group exists.");
    }
  } catch (error) {
    console.error("Error removing user from group:", error);
  }
};