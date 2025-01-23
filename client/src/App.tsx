import './App.css'
import Loading from './pages/loading/loading'
import Login from './pages/login/login'
import { Routes, Route, Navigate } from "react-router-dom"
import SignUp from './pages/signup/signup'
import axios from "axios"
import Home from './pages/home/home'
import Notifications from "./pages/home/components/notifications/notifications"
import HomeContent from './pages/home/components/homecontent/homecontent'
import { useEffect, useState } from 'react'


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
        const response = await axios.get("http://localhost:8080/api/protected", {withCredentials: true});
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
      <>
        <Route path="/" element={loggedIn ? <Home
          username={username} handleLoginStatus={handleLoginStatus} /> : <Navigate to="/login" />}>
          <Route index element={<HomeContent 
              forYouActive={forYouActive}
              handleOnForYouActive={handleOnForYouActive}
              followingActive={followingActive}
              handleOnFollowingActive={handleOnFollowingActive} />} 
            />
          <Route path="/notifications" element={<Notifications />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      </>
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
