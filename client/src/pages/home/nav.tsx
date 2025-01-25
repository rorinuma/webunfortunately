import { Link } from "react-router-dom"
import "./nav.css"
import { GoHome, GoHomeFill} from "react-icons/go";
import { IoNotifications, IoNotificationsOutline, IoSearch, IoSearchOutline, IoMail, IoMailOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import axios from "axios"
import { RiArmchairLine, RiArmchairFill } from "react-icons/ri";
import { MdPeopleOutline, MdPeople } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { BsPerson, BsPersonFill } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import Pfp from "../../assets/placeholderpfp.jpg"
import { useEffect, useRef, useState } from "react"
import { IconContext } from "react-icons";
import { useLocation } from "react-router-dom";

interface Props {
  username: string,
  handlePostButtonActive: () => void,
  handleLoginStatus: (status : boolean | null) => void
}

function Nav({username, handlePostButtonActive, handleLoginStatus} : Props) {
  const profilePopupOptionsRef = useRef<HTMLDivElement | null>(null)
  const profileButtonRef = useRef<HTMLButtonElement | null>(null)
  const [ menuShown, setMenuShown ] = useState(false)
  let location = useLocation()
  
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/logout", {withCredentials: true})
      if(response.status === 200 && response.statusText === "OK") {
        handleLoginStatus(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const toggleProfileMenu = () => {
    setMenuShown((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuShown &&
        profilePopupOptionsRef.current &&
        !profilePopupOptionsRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setMenuShown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuShown]);

  return (
    <nav id="nav-element">
      <div className="title-nav" id="title-nav">
        <div className="nav" id="nav">
          <IconContext.Provider value={{className: "nav-icons"}}>
            <Link to="/" className='nav-twitter-link' ><div><FaXTwitter /></div></Link>
            <Link to="/" className='nav-link' ><div>{location.pathname === "/" ? <GoHomeFill /> : <GoHome />}<div className="nav-annotations">Home</div></div></Link>
            <Link to="/explore" className="nav-link"><div>{location.pathname === "/explore" ? <IoSearch /> : <IoSearchOutline />}<div className="nav-annotations">Explore</div></div></Link>
            <Link to="/notifications" className="nav-link"><div>{location.pathname ==="/notifications" ? <IoNotifications /> : <IoNotificationsOutline />}<div className="nav-annotations">Notifications</div></div></Link>
            <Link to="/messages" className="nav-link"><div>{location.pathname === "/messages" ? <IoMail /> : <IoMailOutline /> }<div className="nav-annotations">Messages</div></div></Link>
            <Link to="/grok" className="nav-link"><div>{location.pathname === "/grok" ? <RiArmchairFill /> : <RiArmchairLine />}<div className="nav-annotations">Grok</div></div></Link>
            <Link to="/communities" className="nav-link"><div>{location.pathname === "/communities" ? <MdPeople /> : <MdPeopleOutline />}<div className="nav-annotations">Communities</div></div></Link>
            <Link to="/premium" className="nav-link"><div><FaXTwitter /><div className="nav-annotations">Premium</div></div></Link>
            <Link to={`profile/${username}`} className="nav-link"><div>{location.pathname === `/profile/${username}` ? <BsPersonFill /> : <BsPerson />}<div className="nav-annotations">Profile</div></div></Link>
            <Link to="/more" className="nav-link"><div><CiCircleMore /><div className="nav-annotations">More</div></div></Link>
          </IconContext.Provider>
          <div className="post-btn-container"><button id="nav-post-btn" onClick={handlePostButtonActive}>Post</button></div>
        </div>
        <div className="profile">
          {menuShown &&  (
            <div className="profile-popup-options" style={{display: "flex"}} ref={profilePopupOptionsRef}>
              <div className="logout-container"><button className="logout-btn"><div>Add an existing account</div></button></div>
              <div className="logout-container"><button onClick={handleLogout}  type="button" className="logout-btn"><div>Log out @{username}</div></button></div>
            </div>
            )}
          <button className="profile-btn" type="button" onClick={toggleProfileMenu} ref={profileButtonRef}>
            <div><img src={Pfp} alt="pfp" className="profilepfp"/></div>
            <div className="profile-username" id="profile-username">
              <div>{username}</div>
              <div className="profile-at">@{username}</div>
            </div>
            <div id="more-btn"><IoIosMore className="more-icon" /></div>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav