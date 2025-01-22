import "./login.css"
import FormInput from "../../components/form-input/form-input"
import { Link, useNavigate } from "react-router-dom"
import { useRef} from "react"
import axios from "axios"

const Login: React.FC = () => {

  const navigate = useNavigate()

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  axios.defaults.withCredentials = true

  const handleSubmit = async (e : React.FormEvent) => {

    e.preventDefault()
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || ""
    const data = {
      username: username,
      password: password
    }
    try {
      const response = await axios.post("http://localhost:8080/api/login", data, {
        headers: {
          'Content-Type': "application/json"
        }
      })
      if(response.status === 200) navigate('/')
 
    } catch(err) {
      console.log(err)
    }
  }
  
  return (
    <div className="login-screen">
      <div className="login-center">
        <form className="login-container" onSubmit={handleSubmit}>
          <div><h2 className="login-header">Login</h2></div>
          <div><FormInput id="username" ref={usernameRef} /></div>
          <div><FormInput id="password" type="password" ref={passwordRef} /></div>
          <div className="login-btn-container"><button className="login-btn"><h4>Login</h4></button></div>
          <div className="signup-link-container"><Link to="/signup" className="signup-link" >Sign up</Link></div>
        </form>  
      </div>
    </div>
  )
}

export default Login