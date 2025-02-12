import { differenceInHours, format, formatDistanceToNowStrict } from "date-fns";
import axios from "axios"
import { toZonedTime } from "date-fns-tz";
import { BtnRefs, TweetInterface } from "../../context/types";

export const sendLikes = async (id : number, liked : boolean, tweets: TweetInterface[], handleSetTweets: (value : TweetInterface[]) => void) => {
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
  } catch(error) {
    if(axios.isAxiosError(error)) {
      console.log(error.stack)
    } else {
      console.error(error)
    }
  }
}

export const formatTweetDate = (created_at: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const tweetDate = toZonedTime(new Date(created_at), userTimeZone)
  const now = new Date()

  if(differenceInHours(now, tweetDate) < 24) {
    return formatDistanceToNowStrict(tweetDate, {addSuffix: false})
  } else {
    return format(tweetDate, "MMM d")
  }
}

export const getOrCreateButtonRef = (index: number, buttonRefs: React.MutableRefObject<BtnRefs[]>) => {
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






