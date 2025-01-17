import { useEffect, useState } from "react"
import "./foryou.css"
import Pfp from "../../../../assets/placeholderpfp.jpg"
import axios from "axios"


function ForYou() {

  interface Tweet {
    text: string,
    username: string,
    at: string,
    date: string,
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
        console.log(response.data.tweets)
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
      {tweets && tweets.map(({text, username, at, date, image}, index) => (
        <div key={index} className="tweet">
          <div className="tweet-content">
            <div className="tweet-content-text">
              <div className="tweet-pfp"><img src={Pfp} alt="tweetPfp"/></div>
              <div className="tweet-content-container">
                <div className="tweet-content-info">
                  <div>{username}</div>
                  <div>@{at}</div>
                  <div>{date}</div>
                </div>
                <div>{text}</div>
                {image && (<div className="tweet-image"><img src={image} alt="imgurl"/></div>)}
              </div>
              <div className="tweet-actions">
                <div className="comment">
                  <div></div>
                  <div></div>
                </div>
                <div className="repost">
                  <div></div>
                  <div></div>
                </div>
                <div className="like">
                  <div></div>
                  <div></div>
                </div>
                <div className="view">
                  <div></div>
                  <div></div>
                </div>
                <div className="bookmark-share">
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ForYou