import { TweetInterface } from "../../../../context/types";
import { formatTweetDate } from "../../../utils/tweetutils";
import styles from "./QuotedTweet.module.css"
import Pfp from "../../../../assets/placeholderpfp.jpg"
import { useNavigate } from "react-router-dom";


interface Props {
  quotedTweet: TweetInterface;
}

const QuotedTweet = ({ quotedTweet }: Props) => {
  const navigate = useNavigate();

  const handleQuotedTweetClick = () => {
    navigate(`/${quotedTweet.username}/status/${quotedTweet.id}`)
  }

  return (
    <div className={styles.quotedTweetContainer} onClick={handleQuotedTweetClick}>
      <div className={styles.quotedUserInfo}>
        <div>
          <img
            src={Pfp}
            alt="quoted-tweet-image"
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
      {quotedTweet.text && <div>{quotedTweet.text}</div>}
      {quotedTweet.image && (
        <img
          src={quotedTweet.image}
          alt="quoted-image"
          className={styles.quotedImage}
        />
      )}
    </div>
  )
}

export default QuotedTweet
