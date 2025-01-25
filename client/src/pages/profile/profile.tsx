import { useParams, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "../loading/loading"
import "./profile.css"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom"
import pfp from "../../assets/placeholderpfp.jpg"

export interface ProfileOutletContextType {
  username: string;
}

const Profile = () => {

  const navigate = useNavigate()
  const { username } = useParams()
  const [ loginScreen, setLoginScreen ] = useState<boolean | null>(true)
  const [ isOwner, setIsOwner ] = useState(false)
  const [ userData, setUserData ] = useState([])
  const [ btnActive, setBtnActive ] = useState(1)

  useEffect(() => {
    const usernameFetch = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${username}`, {
          withCredentials: true,
          headers: {"Content-Type": 'application/json'}
        }) 
        setUserData(response.data.tweets)
        if(response.data.username === username) setIsOwner(true)


      } catch(err){
        console.error(err)
      } finally {
        setLoginScreen(false)
      }
    } 
    usernameFetch()

  }, [])

  const tabs = isOwner 
  ? [
    {id: 1, name: 'Posts', path: `/profile/${username}/`},
    {id: 2, name: 'Replies', path: `/profile/${username}/with_replies`},
    {id: 3, name: 'Highlights', path: `/profile/${username}/highlights`},
    {id: 4, name: 'Articles', path: `/profile/${username}/articles`},
    {id: 5, name: 'Media', path: `/profile/${username}/media`},
    {id: 6, name: 'Likes', path: `/profile/${username}/likes`},
  ] :
  [
    {id: 1, name: 'Posts', path: `/profile/${username}/`},
    {id: 2, name: 'Replies', path: `/profile/${username}/with_replies`},
    {id: 3, name: 'Media', path: `/profile/${username}/media`},
  ]
  
  return (
    <>
      {loginScreen ? <Loading /> : 
        <div className="profile-container">
          <header>
            <div className="sticky">
              <div><button><Link to="/" className="no-defaults"><FaArrowLeft /></Link></button></div>
              <div>
                <div>{username}</div> 
                <div className='post-count'>{userData.length} posts</div>
              </div>
            </div>
          </header>
          <section>
            <div className="profile-header">
              <div className="profile-bg-img"></div>
            </div>
            <div className="profile-overview">
              <div className="profile-actions">
                <div><div className="profile-img"><img src={pfp} alt="" /></div></div>
                <div className="profile-actions-container">{isOwner && <button className="profile-edit-btn">Edit Profile</button>}</div>
              </div>
              <div className="profile-info">
                <div>{username}</div>
                <div className="profile-at">@{username}</div>
                <div>joined xxx</div>
                <div className="follow-stats">
                  <div>x following</div>
                  <div>x followers</div>
                </div>
              </div>
            </div>
          </section>
          <div className="profile-nav">
            {tabs.map((tab) => (
              <div key={tab.id} onClick={() => {setBtnActive(tab.id); navigate(tab.path)}}>
                <div>{tab.name}</div>
                {btnActive === tab.id && <div></div>}
              </div>
            ))}
          </div>
          <div>
            <Outlet context={{username}} />
          </div>
        </div>
      }
    </>
  )
}

export default Profile