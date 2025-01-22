import "./home.css"
import Nav from "../../components/nav/nav"
import { useEffect, useState, useRef } from "react"
import Header from "./components/header/header"
import ForYou from "./components/foryou/foryou"
import Following from "./components/following/following"
import Aside from "./components/aside/aside"
import TweetTextArea from "../../components/tweettextarea/tweettextarea"
import styles from "../../assets/style.module.css"

interface Props {
  username: string;
}

const Home = ({username} : Props) => {
  const tweetPostRef = useRef<HTMLDivElement | null>(null)
  const [forYouActive, setForYouActive] = useState('active')
  const [followingActive, setFollowingActive] = useState('disabled')
  const [postButtonActive, setPostButtonActive ] = useState(false)

  useEffect(() => {
    const handleTweetPostPopup = (event: MouseEvent) => {
      if(
        postButtonActive &&
        tweetPostRef.current &&
        !tweetPostRef.current.contains(event.target as Node)
      ) {
        setPostButtonActive(false)
      }
    };
    document.body.addEventListener('mousedown', handleTweetPostPopup)
    return () => {
      document.body.removeEventListener('mousedown', handleTweetPostPopup)
    }
  }, [postButtonActive])

  const handlePostButtonActive = () => {
    setPostButtonActive((prev) => !prev)
  }

  const handleOnForYouActive = () => {
    setForYouActive('active')
    setFollowingActive('disabled')
  }
  
  const handleOnFollowingActive = () => {
    setForYouActive('disabled')
    setFollowingActive('active')
  }

  return (
    <>
      <div className={postButtonActive ? 'show-post-container' : 'hide-post-container'} ref={tweetPostRef}>
        <div>
          <div><button onClick={() => handlePostButtonActive()}>x</button></div>
          <div className={styles.blueFont}>Drafts</div>
        </div>
        <div>
          <TweetTextArea postButtonActive={postButtonActive} />
        </div>
      </div>
      <div className={postButtonActive ? 'cool-blue-overlay cool-blue-overlay-show' : 'cool-blue-overlay-hide'}></div>
      <div className="home-screen">
        <div className="home-container">
          <Nav username={username} handlePostButtonActive={handlePostButtonActive}/>
          <div className="main-container">
            <div className="main" id="main">
              <div className="wrapuwu" id="wrapuwu">
                <Header
                  forYouActive={forYouActive}
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
    </>
  )
}

export default Home