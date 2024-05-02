import firebaseApp from "./firebase";
import { getFirestore, query, where, collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, increment } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore(firebaseApp);

//--------------------------
// Create/Read/Update/Delete functionality
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

// Fetch user's All Group Space (owned and joined)
export const getAllGroups = async (userId) => {
  try {
    const groupsRef = query(collection(db, "groups"), where("membersId", "array-contains", userId));
    const snapshot = await getDocs(groupsRef);
    const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Retrieved groups:", groups);
    return groups;
  } catch (e) {
    console.error("Error fetching all groups:", e);
  }
};


// Fetch user's Owned Group Space (only owned)
export const getOwnedGroups = async (userId) => {
  try {
    const groupsRef = query(collection(db, "groups"), where("ownerId", "==", userId));
    const snapshot = await getDocs(groupsRef);
    const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
export const updateGroupMember = async(groupId, updatedData) => {
  try {
    await updateDoc(doc(db, "groups", groupId), updatedData);
    console.log(`Group with ID ${groupId} updated`);
  } catch (e) {
    console.error("Error deleting member from group:", e);
  }
}
  