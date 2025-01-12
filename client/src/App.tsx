import './App.css'
import Login from './components/login/login'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import SignUp from './components/signup/signup'
import axios from "axios"
import Showcase from './components/title/components/showcase/showcase'
import Title from './components/title/title'
import Library from './components/title/components/library/library'
import { useEffect, useState, createContext } from 'react'


export const UsernameContext = createContext('')

const DATA = [
  {id: 1, book: "ballsdsadasdasdasdasdasdasdsadsadsadsadasdasdasdsadasdsadsadsadsadsadasdsadsadasdsa"},
  {id: 2, book: 'head'},
  {id: 3, book: "baller"},
  {id: 4, book: 'head'},
  {id: 5, book: 'head'},
  {id: 6, book: 'head'},
  {id: 7, book: 'head'},
  {id: 8, book: 'head'},
  {id: 9, book: 'head'},
  {id: 10, book: 'head'},
  {id: 11, book: 'head'},
  {id: 12, book: 'head'},
  {id: 13, book: 'head'},
  {id: 14, book: 'head'},
  {id: 15, book: 'head'},
  {id: 16, book: 'head'},
  {id: 17, book: 'head'},
  {id: 18, book: 'head'},
  {id: 19, book: 'head'},
  {id: 20, book: 'head'},
  {id: 21, book: 'head'},
  {id: 22, book: 'head'},
  {id: 23, book: 'head'},
  {id: 24, book: 'head'},
  {id: 25, book: 'head'},
  {id: 26, book: 'head'},
  {id: 27, book: 'head'},
  {id: 28, book: 'head'},
  {id: 29, book: 'head'},
  {id: 30, book: 'head'},
  {id: 31, book: 'head'},
  {id: 32, book: 'head'},
  {id: 33, book: 'head'},

]


const App: React.FC = () => {
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
      <Route path="/" element={loggedIn ? <Title username={username}/> : <Navigate to="/login" />} />
      <Route path="/" element={<Title username={username}/>}>
        <Route index element={<Showcase />} />
        <Route path="/library" element={<Library DATA={DATA}/>}/>
      </Route>
    </Routes>
  )
}

export default App
