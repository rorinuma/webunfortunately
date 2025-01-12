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
  username: string
}



function Nav({username} : Props) {
  const navigate = useNavigate()
  const profilePopupOptionsRef = useRef<HTMLDivElement | null>(null)
  const [ menuShown, setMenuShown ] = useState(false)

  // doesn't work TODO tmrw // tomorrow happened, i'm not doing shit today.
  const handlePopupRemovalWhenClickedOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement

    if(profilePopupOptionsRef.current) {
      if (!target.classList.contains('profile-popup-options') && !target.classList.contains('profilepfp') && !target.classList.contains('profile-username') 
        && !target.classList.contains('profile-at') && !target.classList.contains('more') && !target.classList.contains('recents-container')) {
        profilePopupOptionsRef.current.style.display = "none"
        setMenuShown(false)
      }
    }
  }

  useEffect(() => {
    if(menuShown) {
      document.body.addEventListener('click', handlePopupRemovalWhenClickedOutside)
    }
    if(!menuShown) {
      document.body.removeEventListener('click', handlePopupRemovalWhenClickedOutside)
    }
    
    return () => {
      document.body.removeEventListener('click', handlePopupRemovalWhenClickedOutside)
    }
  }, [menuShown])

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
        <Link to="/library" className="nav-link"><div><img src={LibrarySvg} className="nav-svg" alt="librarysvg" /><div>Library</div></div></Link>
        <Link to="/collections" className="nav-link"><div><img src={Collections} className="nav-svg" alt="collectionsysvg" /><div>Collections</div></div></Link>
        <Link to="/cloud" className="nav-link"><div><img src={CloudSvg} className="nav-svg" alt="cloudSvg" /><div>Cloud</div></div></Link>
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