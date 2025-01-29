import { useContext, useEffect } from "react"
import { TweetContext } from "../../pages/home/home"
import { format, formatDistanceToNow } from "date-fns"
import axios from "axios"
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6"
import { AiOutlineRetweet } from "react-icons/ai"
import { IoShareOutline } from "react-icons/io5"
import { CiBookmark } from "react-icons/ci"
import { IoIosMore, IoMdStats } from "react-icons/io"
import { Link } from "react-router-dom"
import "./tweet.css"
import Pfp from "../../assets/placeholderpfp.jpg"
import styles from "../../assets/style.module.css"
import { sendLikes } from "../utils/tweetutils"


interface Props {
  tweetType: string,
  username?: string,
}

const Tweet = ({tweetType, username} : Props) => {
  
  const tweetContext = useContext(TweetContext)
  
  if(!tweetContext) {
    throw new Error('context must be within TweetContext.Provider')
  }
  
  const { handleTweetClick, handleSetTweets, tweets, tweetImgRefs, buttonRefs } = tweetContext 
  
  const doFetch = async (location: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tweets/${location}`, {
        withCredentials: true,
        params: {username: username}
      });
      handleSetTweets(response.data.tweets);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.stack);
      } else {
        console.log('unknown error', err);
      }
    }
  };
  
  useEffect(() => {
    if (tweetType === "all") {
      doFetch("all");
    }
    if(tweetType === 'posts' && username) {
      doFetch("posts")
    }
    if (tweetType === 'liked' && username) {
      doFetch("liked")
    }
  }, [tweetType]);

  const getOrCreateButtonRef = (index: number) => {
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

  const formatTweetDate = (created_at: string) => {
    const date = new Date(created_at);
    const now = new Date();
  
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
    if (diffInDays === 0) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInDays < 7) {
      return format(date, 'EEE');
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MMM d, yyyy'); 
    }
  }
    
  return (
    <div className="tweets-container">
      {tweets && tweets.map(({text, username, created_at, image, at, replies, retweets, likes, views, liked, id}, index) => (
        <div key={index} className="tweet" onClick={(e) => handleTweetClick(e, index, id, at)}>
          <div className="tweet-content-wrapper">
            <div className="tweet-content">
              <div className="tweet-user-info">
                <div className="tweet-pfp"><img src={Pfp} alt="tweetPfp"/></div>
                <div className="tweet-content-container">
                  <div className="tweet-content-info">
                    <div>{username}</div>
                    <div ref={(el) => {getOrCreateButtonRef(index).link = el}}><Link to={`/${at}`} className={styles.dimFont} >@{at}</Link></div>
                    <div className={styles.dimFont}>{formatTweetDate(created_at)}</div>
                  </div>
                  <div className="tweet-text">{text}</div>
                  {image && (<div className="tweet-image"><img src={image} alt="imgurl" ref={(el) => tweetImgRefs.current[index] = el}/></div>)}
                </div>
              </div>
              <div>
                <div></div>
                <div><button ref={(el) => getOrCreateButtonRef(index).more = el}>{<IoIosMore />}</button></div>
              </div>
            </div>
            <div className="tweet-actions-wrapper">
              <div className="tweet-actions">
                <div className="comment">
                  <button data-title="Reply" className={`tweet-action-btn reply-btn blue`}  ref={(el) => getOrCreateButtonRef(index).reply = el} >
                    <div><FaRegComment className='reply-icon' /></div>
                    <div className="reply-text">{replies !== 0 && replies}</div>
                  </button>
                </div>
                <div className="repost" >
                  <button data-title="Repost" className={`tweet-action-btn repost-btn green`} ref={(el) => getOrCreateButtonRef(index).retweet = el}>
                    <div><AiOutlineRetweet className="repost-icon" /></div>
                    <div className="repost-text">{retweets !== 0 && retweets}</div>
                  </button>
                </div>
                <div className="like">
                  <button data-title="Like" className={`tweet-action-btn like-btn red`} ref={(el) => getOrCreateButtonRef(index).like = el} onClick={() => sendLikes((Number(id)), liked, tweets, handleSetTweets)}>
                    <div>{liked ? <FaHeart className="like-icon liked" /> : <FaRegHeart className="like-icon" />}</div>
                    {liked ? <div className="like-text liked">{likes !== 0 && likes}</div> :  <div className="like-text">{likes !== 0 && likes}</div> }
                  </button> 
                </div>
                <div className="view">
                  <button data-title="View"  className={`tweet-action-btn view-btn blue`} ref={(el) => getOrCreateButtonRef(index).view = el}>
                    <div><IoMdStats className="view-icon" /></div>
                    <div className="view-text">{views !== 0 && views}</div>
                  </button>
                </div>
                <div className="bookmark-share">
                  <div><button data-title="Bookmark" className={`tweet-action-btn bookmark-btn blue`} ref={(el) => getOrCreateButtonRef(index).bookmark = el}><CiBookmark className="bookmark-icon"/></button></div>
                  <div><button data-title="Share" className={`tweet-action-btn share-btn blue`} ref={(el) => getOrCreateButtonRef(index).share = el}><IoShareOutline className="share-icon" /></button></div>
                </div>
              </div>
            </div>  
          </div>
        </div>
      ))}
    </div>
  )
}

export default Tweet