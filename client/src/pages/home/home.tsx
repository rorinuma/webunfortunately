import "./home.css"
import Nav from "./components/nav/nav"
import { Outlet } from "react-router-dom"
import Aside from "./components/aside/aside"

interface Props {
  username: string;
  handleLoginStatus: (status: boolean | null) => void
} 

const Home = ({username, handleLoginStatus} : Props) => {

  return (
    <>
      <div className="home-screen">
        <div className="home-container">
          <Nav username={username} handleLoginStatus={handleLoginStatus}/>
          <div className="main-container">
            <div className="main" id="main">
              <div className="wrapuwu" id="wrapuwu">
                <Outlet />
              </div>
              <Aside />
            </div>  
          </div>
        </div>
      </div>
    </>
  )
}

export default Home