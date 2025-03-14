import "./header.css";
import styles from "./header.module.css";
import pfp from "../../../../assets/placeholderpfp.jpg";
import { FaMoneyBills, FaRegBookmark, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoAddCircleOutline, IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { BsPatchCheck, BsPerson } from "react-icons/bs";
import { LiaClipboardSolid } from "react-icons/lia";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { PiSuitcaseSimpleBold } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { IconContext } from "react-icons";

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
  const [isVisible, setIsVisible] = useState(true);
  const [prevScroll, setPrevScroll] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const mobileNavRef = useRef<HTMLElement | null>(null)
  const [userData, setUserData] = useState({user: {username: ""}})
  const { scrollY } = useScroll(); 

  axios.defaults.withCredentials = true
  
  const parentVariants = {
    visible: { opacity: 1, y: 0},
    hidden: { opacity: 0, y: "-7rem"},
  };

  const update = (latest: number, prev: number): void => {
    if(latest < prev) {
      setIsVisible(true)
    } else if (latest > 100 && latest > prev) {
      setIsVisible(false)
    }
  }
  
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    update(latest, prevScroll); 
    setPrevScroll(latest);
  });

  const handleProfileIconBtnClick = async () => {
    setShowMobileNav(true)
    const { data } = await axios.get("http://localhost:8080/api/auth/protected")
    if(data) {
      const response = await axios.get(`http://localhost:8080/api/users/${data.user.username}`)
      setUserData(response.data)
    }
  }

  useEffect(() => {
    const handleOutsideNavClick = (e: MouseEvent) => {
      if (showMobileNav && mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setShowMobileNav(false);
      }
    };

    document.body.addEventListener("mousedown", handleOutsideNavClick);
    return () => document.body.removeEventListener("mousedown", handleOutsideNavClick);
  }, [showMobileNav]);

  const handleLogoutBtnClick = async () => {
    await axios.get("http://localhost:8080/api/auth/logout")
    window.location.reload();
  }

  return (
    <>
      {showMobileNav && 
        createPortal(
          <div className={styles.screenOverlay}>
            <nav className={styles.mobileNav} ref={mobileNavRef}>
              <div className={styles.navWrapper}>
                <div className={styles.mobileTop}>
                  <div><img src={pfp} className={styles.mobilePfp} alt="mobile-pfp"/></div>
                  <div><IoAddCircleOutline className={styles.addSomething}/></div>
                </div>
                <div>
                  <span>{userData.user.username}</span>
                </div>
                <div>
                  <span className={styles.mobileNavAt}>@{userData.user.username}</span>
                </div>
                <div className={styles.followStatsContainer}>
                  <div className={styles.followStats}>
                    <span>x</span>
                    <span className={styles.followStatsText}>Following</span>
                  </div>
                  <div className={styles.followStats}>
                    <span>x</span>
                    <span className={styles.followStatsText}>Followers</span>
                  </div>
                </div>
                <div className={styles.linksContainer}>
                  <IconContext.Provider value={{ className: styles.mobileNavIcons}}>
                    <div className={styles.linkContainer}>
                      <span><BsPerson /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Profile</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><BsPatchCheck /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Premium</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><LiaClipboardSolid /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Lists</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><FaRegBookmark /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Bookmarks</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><AiOutlineThunderbolt /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Verified Orgs</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><FaMoneyBills /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Monetization</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><FaExternalLinkSquareAlt /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Ads</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><PiSuitcaseSimpleBold /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Jobs</Link>
                    </div>
                    <div className={styles.linkContainer}>
                      <span><IoIosSettings /></span>
                      <Link className={styles.mobileNavLink} to={`${userData.user.username}`}>Settings And Privacy</Link>
                    </div>
                    <button onClick={handleLogoutBtnClick} className={styles.linkContainer}>
                      <span><IoLogOutOutline /></span>
                      <span className={styles.mobileNavLink}>Log out</span>
                    </button>
                  </IconContext.Provider>
                </div>
              </div>
            </nav>
          </div>,
          document.body
        )
      }
      <motion.header className={styles.header} variants={parentVariants} animate={isVisible ? "visible" : "hidden"}
        transition={{
          ease: [0.1, 0.25, 0.3, 1],
          duration: 0.6,
          staggerChildren: 0.05,
        }}
      >
        <div className={styles.headerTop} id={styles.headerTop}>
          <button className={styles.pfpBtn} onClick={handleProfileIconBtnClick}>
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
      </motion.header>
    </>
  );
};

export default Header;
