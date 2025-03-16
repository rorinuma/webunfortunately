import { createContext, useContext, useRef, useState } from "react";
import { TweetInterface, BtnRefs } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface TweetContextType {
  handleTweetClick: (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    id: number,
    username: string,
  ) => void;
  handleSetTweets: (
    tweets:
      | TweetInterface[]
      | ((prev: TweetInterface[]) => TweetInterface[])
      | undefined,
  ) => void;
  tweets: TweetInterface[];
  tweetImgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
  buttonRefs: React.MutableRefObject<BtnRefs[]>;
  handleSetReplies: (
    replies: TweetInterface[] | ((prev: TweetInterface[]) => TweetInterface[]),
  ) => void;
  replies: TweetInterface[] | undefined;
  tweet: TweetInterface | undefined;
  handleSetTweet: (tweet: TweetInterface | undefined) => void;
  handleReplyOnStatusComponentClick: (
    tweet: TweetInterface,
    photoId: string | undefined,
  ) => void;
  replyClicked: number | null;
  handleReplyClick: (value: number) => void;
  handleSetReplyClick: (value: number | null) => void;
  setReplyClicked: React.Dispatch<React.SetStateAction<number | null>>;
  retweetPopupRef: React.MutableRefObject<HTMLDivElement | null>;
  retweetOverlayRef: React.MutableRefObject<HTMLDivElement | null>;
  retweetActive: number | null;
  setRetweetActive: React.Dispatch<React.SetStateAction<number | null>>;
  quotedTweetRef: React.MutableRefObject<HTMLDivElement | null>;
  quotedTweetImageRef: React.MutableRefObject<HTMLImageElement | null>;
}

export const TweetContext = createContext<TweetContextType | undefined>(
  undefined,
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
  // the tweet is for the status page, also for the status overlay. other things are incomprehensible.
  const [tweet, setTweet] = useState<TweetInterface>();
  const [tweets, setTweets] = useState<TweetInterface[]>([]);
  const [replies, setReplies] = useState<TweetInterface[]>([]);
  const [replyClicked, setReplyClicked] = useState<number | null>(null);
  const retweetOverlayRef = useRef<HTMLDivElement | null>(null);
  const retweetPopupRef = useRef<HTMLDivElement | null>(null);
  const [retweetActive, setRetweetActive] = useState<number | null>(null);
  const location = useLocation();

  // to check if the quoted tweet has been clicked or not to proceed with its own logic
  const quotedTweetRef = useRef<HTMLDivElement | null>(null);
  const quotedTweetImageRef = useRef<HTMLImageElement | null>(null);

  const handleTweetClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    id: number,
    username: string,
  ) => {

    // why why why why why why it doesn't work i don't get it
    // whatever it doesn't work and i'm not trying to debug this shit
    // this is cancer.....
    if (quotedTweetRef.current && quotedTweetRef.current.contains(e.target as Node) ||
      quotedTweetImageRef.current && quotedTweetImageRef.current.contains(e.target as Node)) {
      return;
    }

    if (
      tweetImgRefs.current[index] &&
      tweetImgRefs.current[index].contains(e.target as Node)
    ) {
      try {
        let newTweet = tweet;

        if ((tweet && tweet.id !== id) || !tweet) {
          const response = await axios.get(
            `http://localhost:8080/api/tweets/placeholder/status/${id}`,
            { withCredentials: true },
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
    // idk why but the retweet overlay above everything works like it's a tweet child even though it's fucking not
    // i guess react portal gift
    const buttonClicked = Object.values(buttonRefs.current[index] || {}).some(
      (ref) => ref.contains(e.target as Node),
    );

    if (
      (retweetPopupRef.current &&
        retweetPopupRef.current.contains(e.target as Node)) ||
      (retweetOverlayRef.current &&
        retweetOverlayRef.current.contains(e.target as Node))
    ) {
      retweetOverlayRef.current = null;
      retweetPopupRef.current = null;
      setRetweetActive(null);
      return;
    }

    if (buttonClicked) {
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
      | undefined,
  ) => {
    setReplies(replies ? replies : []);
  };

  const handleSetTweets = (
    tweets:
      | TweetInterface[]
      | ((prev: TweetInterface[]) => TweetInterface[])
      | undefined,
  ) => {
    setTweets(tweets ? tweets : []);
  };

  const handleReplyOnStatusComponentClick = (
    tweet: TweetInterface,
    photoId: string | undefined,
  ) => {
    handleSetTweet(tweet);
    let state;
    // i don't know how this shit works, like at all lol
    if (photoId) {
      state = { background: location.state?.background, reply: true };
    } else {
      state = { background: location, reply: true };
    }
    navigate("compose/post", { state: state })
    setReplyClicked(tweet.id);
  };

  const handleReplyClick = (value: number) => {
    setReplyClicked(value);
    const updatedTweet = tweets.filter((tweet) => tweet.id === value);
    handleSetTweet(updatedTweet[0]);
    navigate("/compose/post", { state: { background: location, reply: true } });
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
        retweetPopupRef,
        retweetOverlayRef,
        retweetActive,
        setRetweetActive,
        handleReplyOnStatusComponentClick,
        replyClicked,
        handleReplyClick,
        handleSetReplyClick,
        setReplyClicked,
        quotedTweetRef,
        quotedTweetImageRef,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};
