import { useEffect, useState } from "react"
import "./foryou.css"
import Pfp from "../../../../assets/placeholderpfp.jpg"
import axios from "axios"
import { IoShareOutline } from "react-icons/io5";
import { IoMdStats } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import styles from "../../../../assets/style.module.css"
import { IconContext } from "react-icons";

function ForYou() {

  interface Tweet {
    text: string,
    username: string,
    at: string,
    created_at: string,
    image: string | undefined
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

  return (
    <>
      <div className="for-you-tweets-container">
        {tweets && tweets.map(({text, username, created_at, image, at}, index) => (
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
                    <button data-title="Reply" className={`tweet-action-btn reply-btn blue`}>
                      <div><FaRegComment className='reply-icon' /></div>
                      <div></div>
                    </button>
                  </div>
                  <div className="repost">
                    <button data-title="Repost" className={`tweet-action-btn repost-btn green`}>
                      <div><AiOutlineRetweet className="repost-icon" /></div>
                      <div></div>
                    </button>
                  </div>
                  <div className="like">
                    <button data-title="Like" className={`tweet-action-btn like-btn red`}>
                      <div><CiHeart className="like-icon" /></div>
                      <div></div>
                    </button>
                  </div>
                  <IconContext.Provider value={{className: styles.blueButton}}>
                    <div className="view">
                      <button data-title="View" className={`tweet-action-btn view-btn blue`}>
                        <div><IoMdStats className="view-icon" /></div>
                        <div></div>
                      </button>
                    </div>
                    <div className="bookmark-share">
                      <div><button data-title="Bookmark" className={`tweet-action-btn bookmark-btn blue`}><CiBookmark className="bookmark-icon"/></button></div>
                      <div><button data-title="Share" className={`tweet-action-btn share-btn blue`}><IoShareOutline className="share-icon" /></button></div>
                    </div>
                  </IconContext.Provider>
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