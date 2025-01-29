import "./home.css"
import Nav from "./components/nav/nav"
import { useEffect, useState, useRef, createContext } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Aside from "./components/aside/aside"
import TweetTextArea from "../../components/tweettextarea/tweettextarea"
import styles from "../../assets/style.module.css"


interface Props {
  username: string;
  handleLoginStatus: (status: boolean | null) => void
} 

export interface TweetInterface {
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
  id: number,
  index: number
}

export interface BtnRefs {
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
  handleTweetClick: (e: React.MouseEvent<HTMLDivElement>, index: number, id: number, username: string) => void,
  handleSetTweets: (tweets: TweetInterface[]) => void,
  tweets: TweetInterface[],
  tweetImgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>,
  buttonRefs: React.MutableRefObject<BtnRefs[]>
}

export const TweetContext = createContext<TweetContextType | undefined>(undefined)

export const getOrCreateButtonRef = (index: number, buttonRefs: React.MutableRefObject<BtnRefs[]>) => {
  if (!buttonRefs.current[index]) {
    buttonRefs.current[index] = {
      more: null,
      reply: null,
      retweet: null,
      like: null,
      view: null,
      bookmark: null,
      share: null,
      link: null,
    };
  }
  return buttonRefs.current[index];
};

const Home = ({username, handleLoginStatus} : Props) => {

  const tweetPostRef = useRef<HTMLDivElement | null>(null)
  const [postButtonActive, setPostButtonActive ] = useState(false)
  const [ tweets, setTweets ] = useState<TweetInterface[]>([])
  const tweetImgRefs = useRef<(HTMLImageElement | null)[]>([])

  const buttonRefs = useRef<BtnRefs[]>([])
  const navigate = useNavigate()

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

  useEffect(() => {
    if(postButtonActive) document.documentElement.style.overflowY = 'hidden'

    return () => {
      document.documentElement.style.overflowY = ''
    }
  }, [postButtonActive])

  const handlePostButtonActive = () => {
    setPostButtonActive((prev) => !prev)
  }

  const handleTweetClick = (e: React.MouseEvent<HTMLDivElement>, index : number, id: number, username: string) => {
    if(tweetImgRefs.current[index] && tweetImgRefs.current[index].contains(e.target as Node)) {
      navigate(`${username}/status/${id}/photo/1`,)
      return;
    }
    const buttonClicked = Object.values(buttonRefs.current[index] || {}).some(
      (ref) => ref.contains(e.target as Node)
    )
    if(buttonClicked) {
      return
    }
    navigate(`${username}/status/${id}`)
  }

  const handleSetTweets = (tweets: TweetInterface[]) => {
    setTweets(tweets)
  } 

  return (

    <TweetContext.Provider value={{handleTweetClick, handleSetTweets, tweets, tweetImgRefs, buttonRefs}} >
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