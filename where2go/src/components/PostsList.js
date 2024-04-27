import { useState, useEffect } from "react";
import firebaseApp from "../firebase";
import * as db from "../database";
import { collection, query, onSnapshot, getFirestore } from "firebase/firestore";

const firebaseDb = getFirestore(firebaseApp);

export default function PostsList(props) {
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const allPosts = await db.getAllPosts();
        setPosts(allPosts);
    };

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        const q = query(collection(firebaseDb, "posts"));
        return onSnapshot(q, (querySnapshot) => {
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setPosts(results);

        })
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        // CS5356 TO-DO #5 Add Firebase Auth Info
        await db.createPost({
            username: e.target["author-username-input"].value,
            name: e.target["author-name-input"].value,
            message: e.target["message-input"].value,
        });

        await getPosts();
    };
    return (
        <div className="columns">
            <div className="column is-4">
                <form onSubmit={onSubmit}>
                    Author Username:{" "}
                    <input className="input" name="author-username-input" type="text" />
                    <br />
                    Author Name:{" "}
                    <input className="input" name="author-name-input" type="text" />
                    <br />
                    Message: <input name="message-input" className="input" type="text" />
                    <button className="button is-primary">Add</button>
                </form>
            </div>
            <hr className="mb-5" />
            {posts.map((post, index) => {
                return (
                    <article key={index} className="media">
                        <div className="media-left">
                            <figure className="image is-64x64">
                                <img
                                    src="https://bulma.io/images/placeholders/128x128.png"
                                    alt="placeholder"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <div className="content">
                                <p>
                                    <strong>{post.name}</strong>
                                    <small>@{post.username}</small>
                                    <br />
                                    {post.message} - {post.likes}
                                    <button
                                        onClick={async () => {
                                            await db.likePost(post);
                                            await getPosts();
                                        }}
                                        className="button is-primary"
                                    >
                                        Like this
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await db.deletePost(post);
                                            await getPosts();
                                        }}
                                        className="button is-danger"
                                    >
                                        Delete
                                    </button>
                                </p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
