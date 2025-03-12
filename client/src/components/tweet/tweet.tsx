import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { IoIosMore, IoMdStats } from "react-icons/io";
import { Link, matchPath, useLocation, useParams } from "react-router-dom";
import "./tweet.css";
import Pfp from "../../assets/placeholderpfp.jpg";
import globalStyles from "../../assets/style.module.css";
import styles from "./tweet.module.css";
import { formatTweetDate, sendAction } from "../utils/tweetutils";
import Loading from "../../pages/loading/loading";
import { useTweetContext } from "../../context/TweetContext";

interface Props {
  tweetType: string;
  username?: string;
}

const Tweet = ({ tweetType, username }: Props) => {
  const { statusNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const {
    handleTweetClick,
    handleSetTweets,
    tweets,
    tweetImgRefs,
    buttonRefs,
    handleSetReplies,
    replies,
    retweetOverlayRef,
  } = useTweetContext();
  const [newTweetsAvailable, setNewTweetsAvailable] = useState(false);
  const [fetchNewTweets, setFetchNewTweets] = useState(false);
  const [retweetOverlayActiveState, setRetweetOverlayActiveState] =
    useState(false);

  const {
    handleReplyClick,
    setHomeScreenOverlayShown,
    retweetOverlayActive,
    setRetweetOverlayActive,
  } = useTweetContext();
  const observerRef = useRef<IntersectionObserver | undefined>();
  const location = useLocation();

  const dataToRender = statusNumber ? replies : tweets;

  const doTweetsFetch = async (
    location: string,
    status?: string | undefined,
    reset = false
  ) => {
    try {
      const params: Record<string, string | undefined> = { username: username };

      if (status) params.statusNumber = status;
      // reset the page if the button has been clicked idk
      if (reset) {
        setPage(1);
      }
      const response = await axios.get(
        `http://localhost:8080/api/tweets/${location}?page=${page}`,
        {
          withCredentials: true,
          params: params,
        }
      );
      if (status) {
        handleSetReplies((prev) => [...prev, ...response.data.tweets]);
      } else {
        if (reset) {
          handleSetTweets(response.data.tweets);
          setFetchNewTweets(false);
          setNewTweetsAvailable(false);
        } else {
          handleSetTweets((prev) => [...prev, ...response.data.tweets]);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.stack);
      } else {
        console.error("unknown error", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pathsToExclude = [
      "/compose/post",
      "/:username/status/:statusNumber",
      "/:username/status/:statusNumber/photo/:photoId",
    ];

    const shouldResetTweets = !pathsToExclude.some((path) =>
      matchPath(path, location.pathname)
    );

    if (shouldResetTweets) {
      handleSetTweets([]);
    }
  }, [location.pathname]);

  // since the tweet component is also for replies the statusNumber is included too
  // for status update
  useEffect(() => {
    doTweetsFetch(`${tweetType}`, statusNumber && statusNumber, fetchNewTweets);
  }, [tweetType, username, page, statusNumber, fetchNewTweets]);

  // websocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_TWEET_AVAILABLE") {
        setNewTweetsAvailable(true);
      }
    };
  }, []);

  const handleUpdateTweetsButtonClick = () => {
    setFetchNewTweets(true);
    setNewTweetsAvailable(false);
  };

  // observer intersection for infinite scroll
  useEffect(() => {
    if (dataToRender && dataToRender.length < 3) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    const dataElements = document.querySelectorAll(".tweet");
    const thirdLastTweet = dataElements[dataElements.length - 3];

    if (thirdLastTweet) {
      observer.observe(thirdLastTweet);
      observerRef.current = observer;
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [page, replies, tweets]);

  const getOrCreateButtonRef = (index: number) => {
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

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const handleRetweetPopUpActive = (index: number) => {
    setRetweetOverlayActive(index);
    setRetweetOverlayActiveState(prev => !prev);
    setHomeScreenOverlayShown(prev => !prev);
  };

  return (
    <div className="tweets-container">
      {newTweetsAvailable && location.pathname == "/" && (
        <div className="new-tweets-button-container">
          <button
            onClick={handleUpdateTweetsButtonClick}
            className="new-tweets-button"
          >
            new posts
          </button>
        </div>
      )}
      {dataToRender &&
        dataToRender.map(
          (
            {
              text,
              username,
              created_at,
              image,
              at,
              replies,
              retweets,
              likes,
              views,
              liked,
              id,
            },
            index
          ) => (
            <div
              key={index}
              className="tweet"
              onClick={(e) => handleTweetClick(e, index, id, at)}
            >
              <div className="tweet-content-wrapper">
                <div className="tweet-content">
                  <div className="tweet-user-info">
                    <div className="tweet-pfp">
                      <img src={Pfp} alt="tweetPfp" />
                    </div>
                    <div className="tweet-content-container">
                      <div className="tweet-content-info">
                        <div>{username}</div>
                        <div
                          ref={(el) => {
                            getOrCreateButtonRef(index).link = el;
                          }}
                        >
                          <Link to={`/${at}`} className={globalStyles.dimFont}>
                            @{at}
                          </Link>
                        </div>
                        <div className={globalStyles.dimFont}>
                          {formatTweetDate(created_at)}
                        </div>
                      </div>
                      <div className="tweet-text">{text}</div>
                      {image && (
                        <div className="tweet-image">
                          <img
                            src={image}
                            alt="imgurl"
                            ref={(el) => (tweetImgRefs.current[index] = el)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div></div>
                    <div>
                      <button
                        ref={(el) => (getOrCreateButtonRef(index).more = el)}
                      >
                        {<IoIosMore />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tweet-actions-wrapper">
                  <div className="tweet-actions">
                    <div className="comment">
                      <button
                        data-title="Reply"
                        className={`tweet-action-btn reply-btn`}
                        ref={(el) => (getOrCreateButtonRef(index).reply = el)}
                        onClick={() => handleReplyClick(id)}
                      >
                        <div className={"blue tweet-icon"}>
                          <FaRegComment className="reply-icon" />
                        </div>
                        <div className="reply-text"></div>
                        {replies !== 0 && replies}
                      </button>
                    </div>
                    <div className="repost">
                      <button
                        data-title="Repost"
                        className={`tweet-action-btn repost-btn`}
                        ref={(el) => (getOrCreateButtonRef(index).retweet = el)}
                        onClick={() => handleRetweetPopUpActive(index)}
                      >
                        <div className="green tweet-icon">
                          <AiOutlineRetweet className="repost-icon" />
                        </div>
                        <div className="repost-text">
                          {retweets !== 0 && retweets}
                        </div>
                      </button>
                      {retweetOverlayActive === index && (
                        <div
                          className={styles.popUp}
                          ref={
                            retweetOverlayActiveState ? retweetOverlayRef : null
                          }
                        >
                          <div className={styles.popUpContent}>
                            Popup Content Here
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="like">
                      <button
                        data-title="Like"
                        className={`tweet-action-btn like-btn`}
                        ref={(el) => (getOrCreateButtonRef(index).like = el)}
                        onClick={() =>
                          sendAction(
                            Number(id),
                            liked,
                            "likes",
                            dataToRender,
                            statusNumber ? handleSetReplies : handleSetTweets
                          )
                        }
                      >
                        <div className="red tweet-icon">
                          {liked ? (
                            <FaHeart className="like-icon liked" />
                          ) : (
                            <FaRegHeart className="like-icon" />
                          )}
                        </div>
                        {liked ? (
                          <div className="like-text liked">
                            {likes !== 0 && likes}
                          </div>
                        ) : (
                          <div className="like-text">
                            {likes !== 0 && likes}
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="view">
                      <button
                        data-title="View"
                        className={`tweet-action-btn view-btn blue`}
                        ref={(el) => (getOrCreateButtonRef(index).view = el)}
                      >
                        <div className="blue tweet-icon">
                          <IoMdStats className="view-icon" />
                        </div>
                        <div className="view-text">{views !== 0 && views}</div>
                      </button>
                    </div>
                    <div className="bookmark-share">
                      <div>
                        <button
                          data-title="Bookmark"
                          className={`tweet-action-btn bookmark-btn`}
                          ref={(el) =>
                            (getOrCreateButtonRef(index).bookmark = el)
                          }
                        >
                          <CiBookmark className="bookmark-icon" />
                        </button>
                      </div>
                      <div>
                        <button
                          data-title="Share"
                          className={`tweet-action-btn share-btn blue`}
                          ref={(el) => (getOrCreateButtonRef(index).share = el)}
                        >
                          <IoShareOutline className="share-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default Tweet;
