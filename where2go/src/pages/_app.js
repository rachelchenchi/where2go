import { useState, useEffect } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import firebaseApp from '../firebase'
import "@/styles/globals.css";
import NavBar from "../components/NavBar";
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import '@/styles/stars.css'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // We track the auth state to reset firebaseUi if the user signs out.
    return onAuthStateChanged(getAuth(firebaseApp), user => {
      if (!user) {
        // firebaseUiWidget.reset();
        router.push('/');
      }
      setUser(user)
    });
  }, [])

  return (<div>
    <NavBar user={user} />
    <Component user={user} {...pageProps} />
    <Footer />
  </div>);
}