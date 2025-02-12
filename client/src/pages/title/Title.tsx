import styles from "./title.module.css";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import SocialMediaOptions from "./components/SocialMediaOptions/SocialMediaOptions";

const Title = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/signup", { state: { background: location.pathname } });
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { background: location.pathname } });
  };

  return (
    <div className={styles.body}>
      <main className={styles.mainContainer}>
        <div className={styles.logoContainer}>
          <FaXTwitter className={styles.logo} />
        </div>
        <div className={styles.optionsContainer}>
          <div>
            <span className={styles.mainText}>Happening now</span>
          </div>
          <div>
            <span className={styles.join}>Join today.</span>
          </div>
          <SocialMediaOptions />
          <div>
            <button
              className={`${styles.optionsBtn} ${styles.createAccount}`}
              onClick={handleCreateClick}
            >
              <div>Create Account</div>
            </button>
          </div>
          <div>
            <div className={styles.tos}>
              By signing up, you agree to the{" "}
              <Link to="/tos" className={styles.tosLink}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className={styles.tosLink}>
                Privacy Policy
              </Link>
              , including{" "}
              <Link
                to="/rules-and-policies/twitter-cookies"
                className={styles.tosLink}
              >
                Cookie use.
              </Link>
            </div>
          </div>
          <div className={styles.question}>Already have an account?</div>
          <div>
            <button
              className={`${styles.optionsBtn} ${styles.signIn}`}
              onClick={handleLoginClick}
            >
              <div>Sign in</div>
            </button>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <div>
          <Link to="" className="no-defaults">
            About
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Download the X app
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Help Center
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Terms of Service
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Privacy Policy
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Cookie policy
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Accessibility
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Ads info
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Blog
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Careers
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Brand Resources
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Advertising
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Marketing
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            X for Business
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Developers
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Directory
          </Link>
        </div>
        <div>
          <Link to="" className="no-defaults">
            Settings
          </Link>
        </div>
        <div>© 2025 X Corp.</div>
      </footer>
    </div>
  );
};

export default Title;
