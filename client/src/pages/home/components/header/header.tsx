import "./header.css";
import styles from "./header.module.css";
import pfp from "../../../../assets/placeholderpfp.jpg";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface Props {
  forYouActive: string;
  followingActive: string;
  handleOnFollowingActive: () => void;
  handleOnForYouActive: () => void;
}

const Header = ({
  forYouActive,
  followingActive,
  handleOnFollowingActive,
  handleOnForYouActive,
}: Props) => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTop} id={styles.headerTop}>
          <button className={styles.pfpBtn}>
            <img src={pfp} alt="user-pfp" className={styles.pfp} />
          </button>
          <div className={styles.xIconContainer}>
            <FaXTwitter className={styles.xIcon} />
          </div>
          <div className={styles.premiumLinkContainer}>
            <Link to="/i/premium_sign_up" className={styles.premiumLink}>
              Premium
            </Link>
          </div>
        </div>
        <div className={styles.headerPosition}>
          <div className={styles.headerCategoryContainer}>
            <div className={styles.headerCategory}>
              <button
                className={styles.headerBtn}
                onClick={handleOnForYouActive}
              >
                <div className={styles.headerCategoryTextContainer}>
                  <div>For you</div>
                  <div>
                    <div className={forYouActive}></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className={styles.headerCategoryContainer}>
            <div className={styles.headerCategory}>
              <button
                className={styles.headerBtn}
                onClick={handleOnFollowingActive}
              >
                <div className={styles.headerCategoryTextContainer}>
                  <div>Following</div>
                  <div>
                    <div className={followingActive}></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
