import { createContext, useContext, useRef, useState } from "react";
import { TweetInterface, BtnRefs } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface TweetContextType {
  handleTweetClick: (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    id: number,
    username: string
  ) => void;
  handleSetTweets: (
    tweets:
      | TweetInterface[]
      | ((prev: TweetInterface[]) => TweetInterface[])
      | undefined
  ) => void;
  tweets: TweetInterface[];
  tweetImgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
  buttonRefs: React.MutableRefObject<BtnRefs[]>;
  handleSetReplies: (
    replies: TweetInterface[] | ((prev: TweetInterface[]) => TweetInterface[])
  ) => void;
  replies: TweetInterface[] | undefined;
  tweet: TweetInterface | undefined;
  handleSetTweet: (tweet: TweetInterface | undefined) => void;
  retweetOverlayRef: React.MutableRefObject<HTMLDivElement | null>;
  handleReplyOnStatusComponentClick: (
    tweet: TweetInterface,
    photoId: string | undefined
  ) => void;
  handlePostButtonActive: (value: boolean) => void;
  replyClicked: number | null;
  handleReplyClick: (value: number) => void;
  replyOverlayActive: boolean;
  handleSetReplyClick: (value: number | null) => void;
  homeScreenOverlayShown: boolean;
  setHomeScreenOverlayShown: React.Dispatch<React.SetStateAction<boolean>>;
  retweetOverlayActive: number | null;
  setRetweetOverlayActive: React.Dispatch<React.SetStateAction<number | null>>;
}

export const TweetContext = createContext<TweetContextType | undefined>(
  undefined
);

export const useTweetContext = () => {
  const context = useContext(TweetContext);
  if (!context)
    throw new Error("useTweetContext must be used within a TweetProvider");
  return context;
};

export const TweetProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const tweetImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const buttonRefs = useRef<BtnRefs[]>([]);
  const retweetOverlayRef = useRef<HTMLDivElement | null>(null);
  // the tweet is for the status page. other things are incomprehensible.
  const [tweet, setTweet] = useState<TweetInterface>();
  const [tweets, setTweets] = useState<TweetInterface[]>([]);
  const [replies, setReplies] = useState<TweetInterface[]>([]);
  const [replyOverlayActive, setReplyOverlayActive] = useState<boolean>(false);
  const [replyClicked, setReplyClicked] = useState<number | null>(null);
  const [homeScreenOverlayShown, setHomeScreenOverlayShown] = useState(false);
  const [retweetOverlayActive, setRetweetOverlayActive] = useState<
    number | null
  >(null);
  const location = useLocation();

  const handleTweetClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    id: number,
    username: string
  ) => {
    if (
      tweetImgRefs.current[index] &&
      tweetImgRefs.current[index].contains(e.target as Node)
    ) {
      try {
        let newTweet = tweet;

        if ((tweet && tweet.id !== id) || !tweet) {
          const response = await axios.get(
            `http://localhost:8080/api/tweets/placeholder/status/${id}`,
            { withCredentials: true }
          );
          newTweet = response.data.tweet[0];
          handleSetTweet(newTweet);
        }
        navigate(`${username}/status/${id}/photo/1`, {
          state: { background: location, tweet: newTweet },
        });
      } catch (error) {
        console.error(error);
      }
      return;
    }

    const buttonClicked =
      Object.values(buttonRefs.current[index] || {}).some((ref) =>
        ref.contains(e.target as Node)
      ) ||
      (retweetOverlayRef.current &&
        retweetOverlayRef.current.contains(e.target as Node));
    if (buttonClicked) {
      if (homeScreenOverlayShown && retweetOverlayActive !== null) {
        setRetweetOverlayActive(null);
        setHomeScreenOverlayShown(false);
        retweetOverlayRef.current = null;
      }
      return;
    }
    navigate(`${username}/status/${id}`);
  };

  const handleSetTweet = (tweet: TweetInterface | undefined) => {
    setTweet(tweet);
  };

  const handleSetReplies = (
    replies:
      | TweetInterface[]
      | ((prev: TweetInterface[]) => TweetInterface[])
      | undefined
  ) => {
    replies && setReplies(replies);
  };

  const handleSetTweets = (
    tweets:
      | TweetInterface[]
      | ((prev: TweetInterface[]) => TweetInterface[])
      | undefined
  ) => {
    tweets && setTweets(tweets);
  };

  const handleReplyOnStatusComponentClick = (
    tweet: TweetInterface,
    photoId: string | undefined
  ) => {
    handleSetTweet(tweet);
    let state;
    if (photoId) {
      state = { background: location.state?.background };
    } else {
      state = { background: location };
    }
    setReplyClicked(tweet.id);
    setReplyOverlayActive(true);
    navigate("/compose/post", { state });
  };

  const handlePostButtonActive = (value: boolean) => {
    setReplyOverlayActive(!value);
    setReplyClicked(null);
  };

  const handleReplyClick = (value: number) => {
    setReplyClicked(value);
    const updatedTweet = tweets.filter((tweet) => tweet.id === value);
    handleSetTweet(updatedTweet[0]);
    setReplyOverlayActive(true);
    navigate("/compose/post", { state: { background: location } });
  };

  const handleSetReplyClick = (value: number | null) => {
    setReplyClicked(value);
  };

  return (
    <TweetContext.Provider
      value={{
        handleSetReplies,
        handleSetTweets,
        handleTweetClick,
        tweets,
        tweetImgRefs,
        replies,
        buttonRefs,
        handleSetTweet,
        tweet,
        retweetOverlayRef,
        handleReplyOnStatusComponentClick,
        handlePostButtonActive,
        replyClicked,
        handleReplyClick,
        replyOverlayActive,
        handleSetReplyClick,
        homeScreenOverlayShown,
        setHomeScreenOverlayShown,
        retweetOverlayActive,
        setRetweetOverlayActive,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};
