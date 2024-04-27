import { useState, useEffect } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import firebaseApp from '../firebase'
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // We track the auth state to reset firebaseUi if the user signs out.
    return onAuthStateChanged(getAuth(firebaseApp), user => {
      // if (!user) {
      //   firebaseUiWidget.reset();
      // }
      setUser(user)
    });
  }, [])

  return <Component user={user} {...pageProps} />;
}