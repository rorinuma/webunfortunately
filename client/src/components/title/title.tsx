import "./title.css"
import Nav from "../nav/nav"
import { useState } from "react"
import Header from "./components/header/header"
import ForYou from "./components/foryou/foryou"
import Following from "./components/following/following"

interface Props {
  username: string;
}



function Title({username} : Props) {

  const [forYouActive, setForYouActive] = useState('active')
  const [followingActive, setFollowingActive] = useState('disabled')


  const handleOnForYouActive = () => {
      setForYouActive('active')
      setFollowingActive('disabled')
  }
  const handleOnFollowingActive = () => {
      setForYouActive('disabled')
      setFollowingActive('active')
  }



  return (
    <div className="title-screen">
      <div className="title-container">
        <Nav username={username}/>
        <div className="wrapuwu">
          <Header forYouActive={forYouActive}
          handleOnForYouActive={handleOnForYouActive}
          followingActive={followingActive}
          handleOnFollowingActive={handleOnFollowingActive}
          />
          <div className="title-content">
            {forYouActive === 'active' ? <ForYou /> : <Following /> }
          </div>
        </div>
      </div>  
    </div>
  )
}

export default Title