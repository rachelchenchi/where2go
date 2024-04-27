import firebaseApp from "./firebase";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, increment } from "firebase/firestore";

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

export const getPlaces = async () => {
    // Get all the places in your collection
    // Each object should have an id, yelpUrl, tags, and rating
    const result = [];
    const querySnapshot = await getDocs(collection(db, 'places'));
    querySnapshot.forEach((doc) => {
        result.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return result;
};
