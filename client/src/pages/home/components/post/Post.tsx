import pfp from "../../../../assets/placeholderpfp.jpg";
import { formatTweetDate } from "../../../../components/utils/tweetutils";
import { useTweetContext } from "../../../../context/TweetContext";
import styles from "../../../../assets/style.module.css";
import TweetTextArea from "../../../../components/tweettextarea/tweettextarea";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./post.css";
import { createPortal } from "react-dom";

const Post = () => {
  const { tweet } = useTweetContext();
  const { replyClicked, handleSetReplyClick } = useTweetContext();
  const tweetPostRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const reply = location.state?.reply; // WIP

  useEffect(() => {
    const handleTweetPostPopup = (event: MouseEvent) => {
      if (
        location.pathname === "/compose/post" &&
        tweetPostRef.current &&
        !tweetPostRef.current.contains(event.target as Node)
      ) {
        handleSetReplyClick(null);
        navigate(-1);
      }
    };
    document.body.addEventListener("mousedown", handleTweetPostPopup);
    return () => {
      document.body.removeEventListener("mousedown", handleTweetPostPopup);
      document.documentElement.style.overflowY = "";
    };
  }, [location]);

  const handleClosePost = () => {
    handleSetReplyClick(null);
    navigate(-1);
  };

  return createPortal(
    <div className="cool-blue-overlay-show">
      <div className="show-post-container" ref={tweetPostRef}>
        <div>
          <div>
            <button onClick={handleClosePost}>x</button>
          </div>
          <div className={styles.blueFont}>Drafts</div>
        </div>
        {tweet && replyClicked && (
          <div className="post-overlay-reply-container">
            <div className="post-overlay-reply-tweet-info">
              <div>
                <img src={pfp} alt="user-pfp" />
                <div className="bar"></div>
              </div>
              <div>
                <div className="post-overlay-user-info">
                  <div>{tweet.username}</div>
                  <div className={styles.dimFont}>@{tweet.at}</div>
                  <div>{formatTweetDate(tweet.created_at)}</div>
                </div>
                <div className="image-text">
                  {tweet.text ? tweet.text : tweet.image}
                </div>
              </div>
            </div>
            <div>
              <div className="bar2-container">
                <div className="bar2"></div>
              </div>
              <div className="post-overlay-replying-to">
                <div className={styles.dimFont}>
                  Replying to{" "}
                  <span className={styles.blueFont}>@{tweet.at}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="overlay-text-area-container">
          <TweetTextArea
            reply={reply}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Post;
