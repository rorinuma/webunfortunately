import { TweetInterface } from "../../../../context/types";
import { formatTweetDate } from "../../../utils/tweetutils";
import styles from "./QuotedTweet.module.css"
import Pfp from "../../../../assets/placeholderpfp.jpg"
import { useLocation, useNavigate } from "react-router-dom";
import { useTweetContext } from "../../../../context/TweetContext";


interface Props {
  quotedTweet: TweetInterface;
}

const QuotedTweet = ({ quotedTweet }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quotedTweetRef, quotedTweetImageRef } = useTweetContext();

  const handleQuotedTweetClick = (e: React.MouseEvent) => {
    if (e.target as Node === quotedTweetImageRef.current) {
      navigate(`/${quotedTweet.username}/status/${quotedTweet.id}/photo/1`, { state: { background: location, tweet: quotedTweet } })
      return;
    }
    navigate(`/${quotedTweet.username}/status/${quotedTweet.id}`, { state: { quotedTweet: quotedTweet } })
  }

  return (
    <div className={styles.quotedTweetContainer} ref={quotedTweetRef} onClick={handleQuotedTweetClick}>
      <div className={styles.quotedUserInfo}>
        <div>
          <img
            src={Pfp}
            alt="quoted-tweet-pfp"
            className={styles.quotedTweetUserPfp}
          />
        </div>
        <div className={styles.quotedTweetUsername}>
          {quotedTweet.username}
        </div>
        <div className={styles.quotedTweetAt}>
          @{quotedTweet.username}
        </div>
        <div className={styles.quotedTweetDate}>
          {formatTweetDate(quotedTweet.created_at)}
        </div>
      </div>
      {quotedTweet.text && <div className={styles.quotedTweetText}>{quotedTweet.text}</div>}
      {quotedTweet.image && (
        <img
          src={quotedTweet.image}
          alt="quoted-image"
          className={styles.quotedImage}
          ref={quotedTweetImageRef}
        />
      )}
    </div>
  )
}

export default QuotedTweet
