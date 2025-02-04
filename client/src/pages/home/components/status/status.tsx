import { useEffect, useState } from "react"
import styles from "./status.module.css"
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LuSettings2 } from "react-icons/lu";
import axios from "axios";
import pfp from "../../../../assets/placeholderpfp.jpg"
import { Link } from "react-router-dom";
import { IoIosMore } from "react-icons/io"
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz"
import NotFound from "../notfound/NotFound";
import Loading from "../../../loading/loading";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6"
import { AiOutlineRetweet } from "react-icons/ai"
import { IoShareOutline } from "react-icons/io5"
import { IconContext } from "react-icons";
import { CiBookmark } from "react-icons/ci";
import TweetTextArea from "../../../../components/tweettextarea/tweettextarea";
import Tweet from "../../../../components/tweet/tweet";
import { useUIContext } from "../../../../context/UIContext";
import { useTweetContext } from "../../../../context/TweetContext";

const Status = () => {
  const { username, statusNumber, photoId } = useParams()

  const { tweet, handleSetTweet } = useTweetContext()

  const [ loading, setLoading ] = useState<boolean | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const { handleReplyOnStatusComponentClick } = useUIContext()
  const { handleSetReplies } = useTweetContext()

  useEffect(() => {
    handleSetReplies([])
    const statusNumberFetch = async () => {
      handleSetTweet(undefined)
      setLoading(null)
      window.scrollTo(0, 0)
  
      try {
        const response = await axios.get(`http://localhost:8080/api/tweets/placeholder/status/${statusNumber}`, {withCredentials: true})
        handleSetTweet(response.data.tweet[0])
  
      } catch (erorr) {
        setLoading(true)
        console.error('Error occured while fetching tweets by statusNumber')
      } finally {
       setLoading(false)
      }
  }
   statusNumberFetch()
  
  }, [statusNumber])

  const handleImageClick = () => {
    navigate(`/${username}/status/${statusNumber}/photo/1`, {state: {background: location, tweet: tweet}})
  }

  return (
    loading === null ? (
      <Loading />
    ) : (
       !loading && tweet && handleReplyOnStatusComponentClick ? (
        <section className={styles.content}>
          {!photoId && <div className={styles.headerContainer}>
              <header className={styles.header}>
              <div className={styles.headerLeft}>
                <div><button onClick={() => navigate(-1)} className={styles.headerBtn}><FaArrowLeft /></button></div>
                <div className={styles.postHeader}>Post</div>
              </div>
              <div className={styles.headerRight}>
                <div><button className={styles.headerReplyBtn}>Reply</button></div>
                <div><button className={styles.headerBtn}><LuSettings2 /></button></div>
              </div>
            </header>
          </div>}
          <article className={styles.article}>
            <div className={styles.articleLeft}>
              <div><img src={pfp} alt="" className={styles.articlePfp}/></div>
              <div className={styles.userInfo}>
                <Link to={`/${tweet.username}`} className="no-defaults">
                  <div>{tweet.username}</div>
                  <div className={styles.at}>@{tweet.at}</div>
                </Link>
              </div>
            </div>
            <div>
              <div className={styles.moreBtnContainer}><button className={styles.moreBtn}><IoIosMore /></button></div>
            </div>
          </article>
          {tweet.text && !photoId && <div className={styles.tweetText}>{tweet.text}</div>}
          {tweet.image && !photoId && <div className={styles.tweetImage}><img src={tweet.image} alt="tweet-image" onClick={handleImageClick} /></div>}
          <div className={styles.createdAt}>
            <div>
              <Link to={`/${username}/status/${statusNumber}`} className={styles.dateLink}>
                {format(toZonedTime(tweet.created_at, Intl.DateTimeFormat().resolvedOptions().timeZone), "h:mm a · MMM d, yyyy " )}
              </Link></div>
              <span className={styles.dot}>·</span>
            <div> {tweet.views} <span>Views</span></div>  
          </div>
          <div className={styles.actionsContainer}>
            <IconContext.Provider value={{size: "20px"}}>
              <div className={styles.actions}>
                <button className={`${styles.action} ${styles.actionBlue}`} onClick={() => handleReplyOnStatusComponentClick(tweet, photoId)}>
                  <div className={`${styles.action} ${styles.actionImg} ${styles.blueImg}`}><FaRegComment /></div>
                  <div className={styles.blueAmount}>{tweet.replies !== 0 && tweet.replies}</div>
                </button>
                <button className={`${styles.action} ${styles.actionGreen}`}>
                  <div className={`${styles.action} ${styles.actionImg} ${styles.greenImg} `}><AiOutlineRetweet /></div>
                  <div className={styles.greenAmount}>{tweet.retweets !== 0 && tweet.retweets}</div>
                </button>
                <button className={`${styles.action} ${styles.actionRed}`}>
                  <div className={`${styles.action} ${styles.actionImg} ${styles.redImg} ${tweet.liked && styles.redFill}`}>{tweet.liked ? <FaHeart /> : <FaRegHeart />}</div>
                  <div className={`${styles.redAmount} ${tweet.liked && styles.redFill}`}>{tweet.likes !== 0 && tweet.likes}</div>
                </button>
                <button className={`${styles.action} ${styles.actionBlue}`}>
                  <div className={`${styles.action} ${styles.actionImg} ${styles.blueImg}`}><CiBookmark /></div>
                  <div className={styles.blueAmount}>123</div>
                </button>
                <button className={`${styles.action} ${styles.actionBlue}`}>
                  <div className={`${styles.action} ${styles.actionImg} ${styles.blueImg}`}><IoShareOutline /></div>
                </button>
              </div>
            </IconContext.Provider>
          </div>
          <TweetTextArea placeholder="Post your reply"/>
          <Tweet tweetType="all"/>
        </section>
      ) : <NotFound />
    )
  )
}

export default Status