import './App.css'
import Loading from './pages/loading/loading'
import Login from './pages/login/login'
import { Routes, Route, Navigate } from "react-router-dom"
import SignUp from './pages/signup/signup'
import axios from "axios"
import Home from './pages/home/home'
import Notifications from "./pages/home/components/notifications/notifications"
import HomeContent from './pages/home/components/homecontent/homecontent'
import Profile from './pages/profile/profile'
import { useEffect, useState } from 'react'
import Posts from './pages/profile/components/posts/posts'
import Replies from './pages/profile/components/replies/replies'
import Hightlights from './pages/profile/components/highlights/hightlights'
import Articles from './pages/profile/components/articles/articles'
import Media from './pages/profile/components/media/media'
import Likes from './pages/profile/components/likes/likes'
import StatusOverlay from './pages/home/components/statusoverlay/statusoverlay'
import Status from './pages/home/components/status/status'


const App = () => {
  const [ loggedIn, setLoggedIn ] = useState<boolean | null>(null)
  const [ username, setUsername ] = useState('')
  const [forYouActive, setForYouActive] = useState('active')
  const [followingActive, setFollowingActive] = useState('disabled')

  const handleLoginStatus = (status: boolean | null)  => {
    setLoggedIn(status)
  }



  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/protected", {withCredentials: true});
        if(response.status === 200) {
          setUsername(response.data.user.username)
          setLoggedIn(true)
        }
      } catch (err) {
        setLoggedIn(false)
      }
    };
    checkLogin();
  }, [loggedIn])

  const handleOnForYouActive = () => {
    setForYouActive('active')
    setFollowingActive('disabled')
  }

  const handleOnFollowingActive = () => {
    setForYouActive('disabled')
    setFollowingActive('active')
  }

  return (
      <Routes>
        {loggedIn === null ? (
          <Route path="*" element={<Loading />} /> 
        ) : loggedIn ? (
          <Route path="/" element={<Home username={username} handleLoginStatus={handleLoginStatus} />}>
            <Route path="" element={
              <HomeContent 
                forYouActive={forYouActive}
                handleOnForYouActive={handleOnForYouActive}
                followingActive={followingActive}
                handleOnFollowingActive={handleOnFollowingActive} />}
            ><Route path=":username/status/:statusNumber/photo/1" element={<StatusOverlay />} /></Route>
            <Route path=":username" element={<Profile />} >
              <Route index element={<Posts />} />
              <Route path="with_replies" element={<Replies />}/>
              <Route path="highlights" element={<Hightlights />} />
              <Route path="articles" element={<Articles />} />
              <Route path="media" element={<Media />} />
              <Route path="likes" element={<Likes />} />
            </Route>
            <Route path="/:username/status/:statusNumber" element={<Status />}/>
            <Route path="notifications" element={<Notifications />}/>
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login handleLoginStatus={handleLoginStatus}/>}/>
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
  )
}

export default App
