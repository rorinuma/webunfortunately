import { useEffect, useState } from "react"
import "./foryou.css"
import Pfp from "../../../../assets/placeholderpfp.jpg"
import axios from "axios"
import { IoShareOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { IoIosMore, IoMdStats} from "react-icons/io";
import styles from "../../../../assets/style.module.css"

function ForYou() {

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
  }

  const [ tweets, setTweets ] = useState<Tweet[]>([])

  useEffect(() => {
    const doFetch = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tweets', {
        withCredentials: true,
        headers: {'Content-Type': 'multipart/form-data'}}
        )
        setTweets(response.data.tweets)

      } catch (err) {
        if(axios.isAxiosError(err)) {
          console.log(err.stack)
        } else {
          console.log('unknown error', err)
        }
      }
    } 
    doFetch()
  }, [])

  const sendLikes = async (index : number, liked: boolean) => {

    try {
      liked = !liked;
      const updatedTweets = [...tweets];
      updatedTweets[index].liked = liked
      if (liked) {
        updatedTweets[index].likes = (updatedTweets[index].likes || 0) + 1;
      } else {
        updatedTweets[index].likes = Math.max((updatedTweets[index].likes || 0) - 1, 0);
      }
      setTweets(updatedTweets);

      let data = {
        index: index
      }
      await axios.put("http://localhost:8080/api/tweets/likes", data, {
        headers: {"Content-Type": "application/json"},
        withCredentials: true
      })
    } catch(err) {
      console.error(err)
    }
  }




  return (
    <>
      <div className="for-you-tweets-container">
        {tweets && tweets.map(({text, username, created_at, image, at, replies, retweets, likes, views, liked}, index) => (
          <div key={index} className="tweet">
            <div className="tweet-content-wrapper">
              <div className="tweet-content">
                <div className="tweet-user-info">
                  <div className="tweet-pfp"><img src={Pfp} alt="tweetPfp"/></div>
                  <div className="tweet-content-container">
                    <div className="tweet-content-info">
                      <div>{username}</div>
                      <div className={styles.dimFont}>{at}</div>
                      <div className={styles.dimFont}>{created_at}</div>
                    </div>
                    <div className="tweet-text">{text}</div>
                    {image && (<div className="tweet-image"><img src={image} alt="imgurl"/></div>)}
                  </div>
                </div>
                <div>
                  <div></div>
                  <div><button>{<IoIosMore />}</button></div>
                </div>
              </div>
              <div className="tweet-actions-wrapper">
                <div className="tweet-actions">
                  <div className="comment">
                    <button data-title="Reply" className={`tweet-action-btn reply-btn blue`} >
                      <div><FaRegComment className='reply-icon' /></div>
                      <div className="reply-text">{replies !== 0 && replies}</div>
                    </button>
                  </div>
                  <div className="repost">
                    <button data-title="Repost" className={`tweet-action-btn repost-btn green`}>
                      <div><AiOutlineRetweet className="repost-icon" /></div>
                      <div className="repost-text">{retweets !== 0 && retweets}</div>
                    </button>
                  </div>
                  <div className="like">
                    <button data-title="Like" className={`tweet-action-btn like-btn red`} onClick={() => sendLikes(index, liked)}>
                      <div>{liked ? <FaHeart className="like-icon liked" /> : <FaRegHeart className="like-icon" />}</div>
                      {liked ? <div className="like-text liked">{likes !== 0 && likes}</div> :  <div className="like-text">{likes !== 0 && likes}</div> }
                    </button> 
                  </div>
                  <div className="view">
                    <button data-title="View" className={`tweet-action-btn view-btn blue`}>
                      <div><IoMdStats className="view-icon" /></div>
                      <div className="view-text">{views !== 0 && views}</div>
                    </button>
                  </div>
                  <div className="bookmark-share">
                    <div><button data-title="Bookmark" className={`tweet-action-btn bookmark-btn blue`}><CiBookmark className="bookmark-icon"/></button></div>
                    <div><button data-title="Share" className={`tweet-action-btn share-btn blue`}><IoShareOutline className="share-icon" /></button></div>
                  </div>
                </div>
              </div>  
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ForYou