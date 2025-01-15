import { useEffect, useState } from "react"
import "./foryou.css"
import Pfp from "../../../../assets/placeholderpfp.jpg"


function ForYou() {

  const [ tweets, setTweets ] = useState([{text: null, img: undefined}])

  useEffect(() => {
    const tweetsArray = localStorage.getItem('tweets')
    if(tweetsArray) {
      setTweets(JSON.parse(tweetsArray))
    }
  }, [])

  return (
    <div className="for-you-tweets-container">
      {tweets.map((tweet, index) => (
        <div key={index} className="tweet">
          <div className="tweet-content">
            <div className="tweet-content-text">
              <div className="tweet-pfp"><img src={Pfp} alt="tweetPfp"/></div>
              <div className="tweet-content-container">
                <div className="tweet-content-info">
                  <div>username</div>
                  <div>@username</div>
                  <div>date</div>
                </div>
                <div>{tweet.text}</div>
                <div className="tweet-image"><img src={tweet.img} alt="imgurl"/></div>
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