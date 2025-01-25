import "./home.css"
import Nav from "./nav"
import { useEffect, useState, useRef, createContext } from "react"
import { Outlet } from "react-router-dom"
import Aside from "./aside"
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
  handleSetTweets: (tweets: TweetInterface[]) => void,
  tweets: TweetInterface[],
  tweetImgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>,
  buttonRefs: React.MutableRefObject<BtnRefs[]>
}

export const TweetContext = createContext<TweetContextType | undefined>(undefined)


const Home = ({username, handleLoginStatus} : Props) => {

  const tweetPostRef = useRef<HTMLDivElement | null>(null)
  const [postButtonActive, setPostButtonActive ] = useState(false)
  const [ clickedImg, setClickedImg ] = useState<number | null>(null)
  const [ clickedDiv, setClickedDiv ] = useState<number | null>(null)
  const [ tweets, setTweets ] = useState<TweetInterface[]>([])
  const tweetImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const presentationImgRef = useRef<HTMLImageElement | null>(null)
  const presentationCommentsRef = useRef<HTMLDivElement | null>(null)
  const presentationActionsRef = useRef<HTMLDivElement | null>(null)
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
      setClickedImg(index)
      return;
    }
    const buttonClicked = Object.values(buttonRefs.current[index] || {}).some(
      (ref) => ref.contains(e.target as Node)
    )
    if(buttonClicked) {
      return
    }
    setClickedDiv(index)
  }

  const handleSetTweets = (tweets: TweetInterface[]) => {
    setTweets(tweets)
  } 

  const handlePresentationImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(presentationImgRef.current && !presentationImgRef.current.contains(e.target as Node) &&
      presentationCommentsRef.current && !presentationImgRef.current.contains(e.target as Node) &&
      presentationActionsRef.current && !presentationActionsRef.current.contains(e.target as Node)
      ) setClickedImg(null)
  }

  return (
    <TweetContext.Provider value={{handleTweetClick, handleSetTweets, tweets, tweetImgRefs, buttonRefs}} >
      {clickedImg !== null && (
        <div className="tweet-presentation">
          <div className="tweet-image-presentation">
            <div onClick={handlePresentationImageClick}>
              <div className="tweet-presentation-btn"><button >x</button></div>
              <div className="presentation-image"><img src={tweets[clickedImg].image} alt="presentation-img" ref={presentationImgRef}/></div>
              <div><button></button></div>
            </div>
            <div>
              <div className="presentation-actions" ref={presentationActionsRef}>

              </div>
            </div>
          </div>
          <div className="tweet-image-click-comments" ref={presentationCommentsRef}>

          </div>
        </div>
        )}
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