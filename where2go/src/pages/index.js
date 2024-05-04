import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { getAuth } from 'firebase/auth'
import firebaseApp from '../firebase'
import Link from "next/link";
import PostsList from "../components/PostsList";
import React, { useState, useEffect } from 'react';
import * as db from '../database';
import PlaceDisplay from '../components/places/PlaceDisplay';
import { Analytics } from "@vercel/analytics/react"



const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {

  const [places, setPlaces] = useState([]);
  const loadPlaces = async () => {
    const fetchedPlaces = await db.getCommunityPlaces();
    setPlaces(fetchedPlaces);
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const handleReloadPlaces = () => {
    loadPlaces();
  };

  // const onSignOutClicked = () => {
  //   const auth = getAuth(firebaseApp);
  //   auth.signOut()
  // }

  return (
    <>
      <Head>
        <title>where2go</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {/* <div className={styles.description}>
          {props.user && <button onClick={onSignOutClicked}>Sign Out</button>}
          {!props.user && <Link href="/login">Login</Link>}
          <p>
            {props.user && JSON.stringify(props.user, null, 2)}
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
        </div> */}

        <section className="hero is-medium" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/assets/background3.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          minHeight: '100vh'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}>
            <h1 style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }} className="title is-1 has-text-white has-text-weight-bold">
              Welcome to WHERE2GO
            </h1>
            <h2 style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }} className="subtitle is-3 has-text-white">
              Enjoy every moment!
            </h2>
          </div>
        </section>


        <section style={{
          backgroundImage: "url('/assets/info.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          minHeight: '100vh'  // Adjust the height as needed
        }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* placeholder */}
          </div>
        </section>


        <section style={{ paddingTop: '50px' }}>
          <div class="hero-body">
            <div class="container has-text-centered">
              <h1 class="title is-3 has-text-black">
                Take a look at what favorites others have!
              </h1>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "20px" }}>
            <button onClick={handleReloadPlaces} class="button is-info" style={{ fontSize: "24px", color: "white", fontWeight: "bolder" }}>&#10227;</button>
          </div>
          <div className="places-container">
            {places.map((place) => (
              <PlaceDisplay key={place.id} className="place-display" place={place}
                showButtons={false} />
            ))}
          </div>
        </section>

        {/* <PostsList /> */}
      </main >
      <Analytics />
    </>
  );
}
