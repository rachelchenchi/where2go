import Link from "next/link";
import { getAuth } from "firebase/auth";
import firebaseApp from "../firebase";
import styles from "./Navbar.module.css"; // Import CSS module for styling
import { useRouter } from "next/router";

const Navbar = ({ user }) => {
  const router = useRouter();

  const onSignOutClicked = () => {
    const auth = getAuth(firebaseApp);
    auth.signOut();
    // router.push('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <Link href="/" className="navbar-item has-text-weight-bold is-size-4">
                <img src="/hands-up.png" alt="Logo" style={{ marginRight: '10px' }} />
                <span>WHERE2GO</span>
            </Link>
            <Link href="/private" className="navbar-item">
                Private Space
            </Link>
            <Link href="/group" className="navbar-item">
                Group Space
            </Link>
        </div>

        <div className="navbar-end">
          {user ? (
            <>
              <div className="navbar-item">
                <span>{user.displayName || user.uid}</span>
              </div>
              <div className="navbar-item">
                <button onClick={onSignOutClicked} className="button is-light">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-item">
              <Link href="/login">
                <button className="button is-info">Sign in</button>
              </Link>
            </div>
          )}
        </div>
    </nav>
  );
};

export default Navbar;
