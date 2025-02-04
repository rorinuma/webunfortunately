import { createContext, useContext, useRef, useState } from "react";
import { TweetInterface, BtnRefs } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUIContext } from "./UIContext";

interface TweetContextType {
  handleTweetClick: (e: React.MouseEvent<HTMLDivElement>, index: number, id: number, username: string) => void;
  handleSetTweets: (tweets: TweetInterface[] | ((prev: TweetInterface[]) => TweetInterface[]) | undefined) => void;
  tweets: TweetInterface[];
  tweetImgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
  buttonRefs: React.MutableRefObject<BtnRefs[]>;
  handleSetReplies: (replies: TweetInterface[] | ((prev: TweetInterface[]) => TweetInterface[])) => void;
  replies: TweetInterface[] | undefined;
  tweet: TweetInterface | undefined,
  handleSetTweet: (tweet: TweetInterface | undefined) => void
}

export const TweetContext = createContext<TweetContextType | undefined>(undefined);

export const useTweetContext = () => {
  const context = useContext(TweetContext);
  if (!context) throw new Error("useTweetContext must be used within a TweetProvider");
  return context;
};

export const TweetProvider = ({children}: {children: React.ReactNode}) => {
  const navigate = useNavigate()
  const tweetImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const buttonRefs = useRef<BtnRefs[]>([])
  const [ tweet, setTweet ] = useState<TweetInterface>()
  const [ tweets, setTweets ] = useState<TweetInterface[]>([])
  const [ replies, setReplies ] = useState<TweetInterface[]>([])
  const location = useLocation()
  
  const handleTweetClick = async (e: React.MouseEvent<HTMLDivElement>, index : number, id: number, username: string) => {
    if(tweetImgRefs.current[index] && tweetImgRefs.current[index].contains(e.target as Node)) {
      try {
        let newTweet = tweet
        
        if(tweet && tweet.id !== id || !tweet) {
          const response = await axios.get(`http://localhost:8080/api/tweets/placeholder/status/${id}`, {withCredentials: true})
          newTweet = response.data.tweet[0]
          handleSetTweet(newTweet)
        } 

        console.log('navigating to overlay with tweet', newTweet)
        navigate(`${username}/status/${id}/photo/1`, {state: {background: location, tweet: newTweet}})
        
      } catch (error) {
        console.error(error)
      }
      return;
    }
    const buttonClicked = Object.values(buttonRefs.current[index] || {}).some(
      (ref) => ref.contains(e.target as Node)
    )
    if(buttonClicked) {
      return
    }
    navigate(`${username}/status/${id}`)
  }

  const handleSetTweet = (tweet: TweetInterface | undefined) => {
    setTweet(tweet)
  }
  
  const handleSetReplies = (replies: TweetInterface[] | ((prev: TweetInterface[]) => TweetInterface[]) | undefined) => {
    replies && setReplies(replies)
  }  

  const handleSetTweets = (tweets: TweetInterface[] | ((prev: TweetInterface[]) => TweetInterface[]) | undefined) => {
   tweets && setTweets(tweets)
  } 

  return (
    <TweetContext.Provider value={{
        handleSetReplies, 
        handleSetTweets, 
        handleTweetClick,
        tweets,
        tweetImgRefs,
        replies,
        buttonRefs,
        handleSetTweet,
        tweet,
      }}
    >
      {children}
    </TweetContext.Provider>
  )
}