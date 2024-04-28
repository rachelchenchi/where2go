import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase';
import styles from './Navbar.module.css'; // Import CSS module for styling
import { useRouter } from 'next/router';

const Navbar = ({ user }) => {
    const router = useRouter();

    const onSignOutClicked = () => {
        const auth = getAuth(firebaseApp);
        auth.signOut();
        // router.push('/');
    };

    return (
        <nav className={styles.navbar}> {/* Apply styles to the Navbar */}
            <div className={styles.navbarLeft}>
                <Link href="/" className={styles.link}>Home</Link> {/* Navigation links on the left */}
                <Link href="/private" className={styles.link}>Private Space</Link>
                <Link href="/group" className={styles.link}>Group Space</Link>
            </div>
            <div className={styles.navbarCenter}>
                <span>WHERE2GO</span> {/* Centered logo or text */}
            </div>
            <div className={styles.navbarRight}> {/* Navigation links on the right */}
                {user ? (
                    <button onClick={onSignOutClicked} className={styles.signOutButton}>
                        Sign Out
                    </button>
                ) : (
                    <Link href="/login">
                        <button className={styles.signInButton}>Sign in</button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
