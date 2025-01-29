import { IconContext } from "react-icons"
import { useNavigate, useParams } from "react-router-dom"
import {  TweetInterface } from "../../home"
import { useRef, useEffect, useState, useContext } from "react"
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6"
import { AiOutlineRetweet } from "react-icons/ai"
import { IoShareOutline } from "react-icons/io5"
import {  IoMdStats } from "react-icons/io"
import ReactDOM from "react-dom"
import "./statusoverlay.css"
import axios from "axios"
import Loading from "../../../loading/loading"
import { OverlayContext } from "../../../../components/overlay/OverlayContext"

const StatusOverlay = () => {

  const [ tweet, setTweet ] = useState<TweetInterface>()
  const { username, statusNumber } = useParams()
  const paramsContext = useContext(OverlayContext)

  const navigate = useNavigate()
  const presentationImgRef = useRef<HTMLImageElement | null>(null)
  const presentationCommentsRef = useRef<HTMLDivElement | null>(null)
  const presentationActionsRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const doFetch = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/tweets/${username}/status/${statusNumber}`, {withCredentials: true})
        setTweet(response.data.tweet[0])

      } catch(error) {
        console.error("Error occured while accessing the server by status id", error)
      }
    }
    doFetch()
  }, [statusNumber, username])

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden'

    return () => {
      document.documentElement.style.overflowY = ''
    }
  }, [])

  if (!tweet) {
    return <div>{<Loading />}</div>;
  }

  const handlePresentationImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(presentationImgRef.current && !presentationImgRef.current.contains(e.target as Node) &&
      presentationCommentsRef.current && !presentationImgRef.current.contains(e.target as Node) &&
      presentationActionsRef.current && !presentationActionsRef.current.contains(e.target as Node)
      ) navigate(-1)
  }

  return ReactDOM.createPortal(
    <div className="tweet-presentation">
      <div className="tweet-image-presentation" onClick={handlePresentationImageClick}>
        <div>
          <div className="tweet-presentation-btn"><button >x</button></div>
          <div className="presentation-image"><img src={tweet.image} alt="presentation-img" ref={presentationImgRef}/></div>
          <div><button></button></div>
        </div>
        <div>
          <div className="presentation-actions" ref={presentationActionsRef}>
            <IconContext.Provider value={{size: "20px"}}>
              <div><button className="presentation-comment-btn"><div className="presentation-comment">{<FaRegComment />}</div> <div>{tweet.replies}</div></button></div>
              <div><button className="presentation-retweet-btn"><div className="presentation-retweet">{<AiOutlineRetweet />}</div> <div className="presentation-retweet-count">{tweet.retweets}</div></button></div>
              <div>
                <button className="presentation-comment-btn">{tweet.liked ? <div className="presentation-comment"><FaHeart /></div> : <div><FaRegHeart /></div>} <div>{tweet.likes}</div></button>
              </div>
              <div><button className="presentation-view-btn"><div className="presentation-view"><IoMdStats /></div> <div className="presentation-view-count">{tweet.views}</div></button></div>
              <div><button><div className="presentation-share"><IoShareOutline /></div></button></div>
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div className="tweet-presentation-comments" ref={presentationCommentsRef}>

      </div>
    </div>,
    document.body
  )
}

export default StatusOverlay