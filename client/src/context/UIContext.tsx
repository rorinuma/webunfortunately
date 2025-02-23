import { createContext, SetStateAction, useContext, useState } from "react";
import { TweetInterface } from "./types";
import { useTweetContext } from "./TweetContext";
import { useLocation, useNavigate } from "react-router-dom";

interface UIContextType {
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
  setHomeScreenOverlayShown: React.Dispatch<SetStateAction<boolean>>;
  retweetOverlayActive: number | null;
  setRetweetOverlayActive: React.Dispatch<SetStateAction<number | null>>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context)
    throw new Error("useUIContext must be used within a UIProvider");
  return context;
};

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [replyOverlayActive, setReplyOverlayActive] = useState<boolean>(false);
  const [replyClicked, setReplyClicked] = useState<number | null>(null);
  const [homeScreenOverlayShown, setHomeScreenOverlayShown] = useState(false);
  const [retweetOverlayActive, setRetweetOverlayActive] = useState<
    number | null
  >(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { tweets, handleSetTweet } = useTweetContext();

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
    <UIContext.Provider
      value={{
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
    </UIContext.Provider>
  );
};
