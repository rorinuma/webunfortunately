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
          console.log('unknown axios error', err)
        }
      }
    } 
    doFetch()
  }, [])

  return (
    <div className="for-you-tweets-container">
      {tweets && tweets.map(({text, username, created_at, image, at}, index) => (
        <div key={index} className="tweet">
          <div className="tweet-content">
            <div className="tweet-user-info">
              <div className="tweet-pfp"><img src={Pfp} alt="tweetPfp"/></div>
              <div className="tweet-content-container">
                <div className="tweet-content-info">
                  <div>{username}</div>
                  <div>{at}</div>
                  <div>{created_at}</div>
                </div>
                <div>{text}</div>
                {image && (<div className="tweet-image"><img src={image} alt="imgurl"/></div>)}
              </div>
            </div>
            <div className="tweet-actions">
              <div className="comment">
                <button data-title="Reply">
                  <div><FaRegComment className="tweet-icon" /></div>
                  <div></div>
                </button>
              </div>
              <div className="repost">
                <button data-title="Repost">
                  <div><AiOutlineRetweet className="tweet-icon" /></div>
                  <div></div>
                </button>
              </div>
              <div className="like">
                <button data-title="Like">
                  <div><CiHeart className="tweet-icon" /></div>
                  <div></div>
                </button>
              </div>
              <div className="view">
                <button data-title="View">
                  <div><IoMdStats /></div>
                  <div></div>
                </button>
              </div>
              <div className="bookmark-share">
                <div><button><CiBookmark /></button></div>
                <div><button><IoShareOutline /></button></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ForYou