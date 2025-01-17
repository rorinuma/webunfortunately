import { Link, useNavigate } from "react-router-dom"
import "./nav.css"
import HomeSvg from "../../assets/home.svg"
import axios from "axios"
import LibrarySvg from "../../assets/library.svg"
import Collections from "../../assets/collections.svg"
import CloudSvg from "../../assets/cloud.svg"
import Pfp from "../../assets/placeholderpfp.jpg"
import More from "../../assets/more.svg"
import { useRef, useState } from "react"

interface Props {
  username: string
}



function Nav({username} : Props) {
  const navigate = useNavigate()
  const profilePopupOptionsRef = useRef<HTMLDivElement | null>(null)
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

  const handleProfileBtnClick = () => {
    if(profilePopupOptionsRef.current) {
      if(profilePopupOptionsRef.current.style.display === 'none') {
        profilePopupOptionsRef.current.style.display = 'flex'
        setMenuShown(true)
      } else {
        profilePopupOptionsRef.current.style.display = 'none'
        setMenuShown(false)
      }
    } 
  }

  return (
    <nav className="title-nav">
      <div className="nav">
        <Link to="/" className="nav-link"><div><img src={HomeSvg} className="nav-svg" alt="homesvg" /><div>Home</div></div></Link>
        <Link to="/explore" className="nav-link"><div><img src={LibrarySvg} className="nav-svg" alt="librarysvg" /><div>Explore</div></div></Link>
        <Link to="/notifications" className="nav-link"><div><img src={Collections} className="nav-svg" alt="collectionsysvg" /><div>Notifications</div></div></Link>
        <Link to="/messages" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>Messages</div></div></Link>
        <Link to="/grok" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>Grok</div></div></Link>
        <Link to="/communities" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>Communities</div></div></Link>
        <Link to="/premium" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>Premium</div></div></Link>
        <Link to="/profile" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>Profile</div></div></Link>
        <Link to="/more" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>More</div></div></Link>
        <div className="post-btn-container"><button>Post</button></div>
      </div>
      <div className="profile">
        <div className="profile-popup-options" ref={profilePopupOptionsRef}>
          <div className="logout-container"><button onClick={handleLogout}  type="button" className="logout-btn"><div>Log out @{username}</div></button></div>
        </div>
        <button className="profile-btn" type="button" onClick={handleProfileBtnClick}>
          <div><img src={Pfp} alt="pfp" className="profilepfp"/></div>
          <div className="profile-username">
            <div>{username}</div>
            <div className="profile-at">@{username}</div>
          </div>
          <div><img src={More} alt="more" className="more"/></div>
        </button>
      </div>
    </nav>
  )
}

export default Nav