import { TweetInterface } from "../../pages/home/home";
import axios from "axios"

export const sendLikes = async (id : number, liked : boolean, tweets: TweetInterface[], handleSetTweets : (value : TweetInterface[]) => void) => {
  liked = !liked
  try {
    const updatedTweets = tweets.map((tweet) => {
      return tweet.id === id ? {...tweet, liked: liked, likes: liked ? (tweet.likes ?? 0) + 1 : tweet.likes && tweet.likes - 1 } : tweet
    })
    handleSetTweets(updatedTweets);
    
    let data = {
      tweetId: id
    }
    await axios.put("http://localhost:8080/api/tweets/likes", data, {
      headers: {"Content-Type": "application/json"},
      withCredentials: true
    })
  } catch(err) {
    if(axios.isAxiosError(err)) {
      console.log(err.stack)
    } else {
      console.error(err)
    }
  }
}