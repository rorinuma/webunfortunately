import { Link, useNavigate } from "react-router-dom"
import "./nav.css"
import HomeSvg from "../../assets/home.svg"
import axios from "axios"
import LibrarySvg from "../../assets/library.svg"
import Collections from "../../assets/collections.svg"
import CloudSvg from "../../assets/cloud.svg"
import Pfp from "../../assets/placeholderpfp.jpg"
import More from "../../assets/more.svg"
import { useEffect, useRef, useState } from "react"

interface Props {
  username: string,
  handlePostButtonActive: () => void
}

function Nav({username, handlePostButtonActive} : Props) {
  const navigate = useNavigate()
  const profilePopupOptionsRef = useRef<HTMLDivElement | null>(null)
  const profileButtonRef = useRef<HTMLButtonElement | null>(null)
  const [ menuShown, setMenuShown ] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/logout", {withCredentials: true})
      console.log(response.data)
      navigate("/login")
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
          <Link to="/" className="nav-link"><div><img src={HomeSvg} className="nav-svg" alt="homesvg" /><div className="nav-annotations">Home</div></div></Link>
          <Link to="/explore" className="nav-link"><div><img src={LibrarySvg} className="nav-svg" alt="librarysvg" /><div className="nav-annotations">Explore</div></div></Link>
          <Link to="/notifications" className="nav-link"><div><img src={Collections} className="nav-svg" alt="collectionsysvg" /><div className="nav-annotations">Notifications</div></div></Link>
          <Link to="/messages" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div className="nav-annotations">Messages</div></div></Link>
          <Link to="/grok" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div className="nav-annotations">Grok</div></div></Link>
          <Link to="/communities" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div className="nav-annotations">Communities</div></div></Link>
          <Link to="/premium" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div className="nav-annotations">Premium</div></div></Link>
          <Link to="/profile" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div className="nav-annotations">Profile</div></div></Link>
          <Link to="/more" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div className="nav-annotations">More</div></div></Link>
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
            <div id="more-btn"><img src={More} alt="more" className="more"/></div>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav