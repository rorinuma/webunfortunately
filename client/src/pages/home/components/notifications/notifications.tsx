import styles from "./notifications.module.css";
import { CiSettings } from "react-icons/ci";

const Notifications = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.title}>Notifications</div>
        <div>
          <button>
            <CiSettings />
          </button>
        </div>
      </div>
      <div className={styles.headerBottom}>
        
      </div>
    </header>
  );
};

export default Notifications;
