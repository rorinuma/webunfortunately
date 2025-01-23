import "./home.css"
import Nav from "../../components/nav/nav"
import { useEffect, useState, useRef, createContext } from "react"
import { Outlet } from "react-router-dom"
import Aside from "./components/aside/aside"
import TweetTextArea from "../../components/tweettextarea/tweettextarea"
import styles from "../../assets/style.module.css"

interface Props {
  username: string;
  handleLoginStatus: (status: boolean | null) => void
} 

interface Tweet {
  text: string,
  username: string,
  at: string,
  created_at: string,
  image: string | undefined,
  replies: number | null,
  retweets: number | null,
  likes: number | null,
  views: number | null,
  liked: boolean,
  id: number
}

interface BtnRefs {
  more: HTMLButtonElement | null,
  reply: HTMLButtonElement | null,
  retweet: HTMLButtonElement | null,
  like: HTMLButtonElement | null,
  view: HTMLButtonElement | null,
  bookmark: HTMLButtonElement | null,
  share: HTMLButtonElement | null,
  link: HTMLDivElement | null,
}

interface TweetContextType {
  handleTweetClick: (e: React.MouseEvent<HTMLDivElement>, index: number) => void,
  handleSetTweets: (tweets: Tweet[]) => void,
  tweets: Tweet[],
  tweetImgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>,
  buttonRefs: React.MutableRefObject<BtnRefs[]>
}

export const TweetContext = createContext<TweetContextType | undefined>(undefined)


const Home = ({username, handleLoginStatus} : Props) => {

  const tweetPostRef = useRef<HTMLDivElement | null>(null)
  const [postButtonActive, setPostButtonActive ] = useState(false)
  const [ clickedImg, setClickedImg ] = useState<number | null>(null)
  const [ clickedDiv, setClickedDiv ] = useState<number | null>(null)
  const [ tweets, setTweets ] = useState<Tweet[]>([])
  const tweetImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const buttonRefs = useRef<BtnRefs[]>([])

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

  const handleTweetClick = (e: React.MouseEvent<HTMLDivElement>, index : number) => {
    if(tweetImgRefs.current[index] && tweetImgRefs.current[index].contains(e.target as Node)) {
      setClickedImg(tweets[index].id)
      return;
    }
    const buttonClicked = Object.values(buttonRefs.current[index] || {}).some(
      (ref) => ref.contains(e.target as Node)
    )
    if(buttonClicked) {
      return
    }
    setClickedDiv(tweets[index].id)
  }

  const handleSetTweets = (tweets: Tweet[]) => {
    setTweets(tweets)
  } 

  return (
    <TweetContext.Provider value={{handleTweetClick, handleSetTweets, tweets, tweetImgRefs, buttonRefs}} >
      {clickedDiv && <div>tweet has been clicked with the id of {clickedDiv}</div>}
      {clickedImg && <div>image has been clicked with the id of {clickedImg}</div>}
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
          <Nav username={username} handlePostButtonActive={handlePostButtonActive} handleLoginStatus={handleLoginStatus}/>
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
    </TweetContext.Provider>
  )
}

export default Home