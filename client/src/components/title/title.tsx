import "./title.css"
import Nav from "../nav/nav"
import { Outlet } from "react-router-dom"
import Header from "./components/header/header"

interface Props {
  username: string;
}



function Title({username} : Props) {


  return (
    <div className="title-screen">
      <div className="title-container">
        <Nav username={username}/>
        <div className="wrapuwu">
          <Header />
          <div className="title-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Title