import './App.css'
import Login from './pages/login/login'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import SignUp from './pages/signup/signup'
import axios from "axios"
import Home from './pages/home/home'
import { useEffect, useState } from 'react'


const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ username, setUsername ] = useState('')
  const navigate = useNavigate()

  const loginCheck = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/protected", {withCredentials: true} )
      setUsername(response.data.user.username)
      return true
    } catch (error) {
      console.error(error)
      setUsername('')
      return false
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      setLoggedIn(await loginCheck());
      loggedIn ? null : navigate("/login");
    };
    checkLogin();
  }, [])
  
  return (
    <Routes>
      <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login />}/>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={loggedIn ? <Home username={username}/> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
