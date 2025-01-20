import "./home.css"
import Nav from "../../components/nav/nav"
import { useState } from "react"
import Header from "./components/header/header"
import ForYou from "./components/foryou/foryou"
import Following from "./components/following/following"
import Aside from "./components/aside/aside"

interface Props {
  username: string;
}

function Home({username} : Props) {

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
    <div className="home-screen">
      <div className="home-container">
        <Nav username={username}/>
        <div className="main-container">
          <div className="main" id="main">
            <div className="wrapuwu" id="wrapuwu">
              <Header forYouActive={forYouActive}
              handleOnForYouActive={handleOnForYouActive}
              followingActive={followingActive}
              handleOnFollowingActive={handleOnFollowingActive}
              />
              <div className="home-content">
                {forYouActive === 'active' ? <ForYou /> : <Following /> }
              </div>
            </div>
            <Aside />
          </div>  
        </div>
      </div>
    </div>
  )
}

export default Home