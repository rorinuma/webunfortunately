import { differenceInHours, format, formatDistanceToNowStrict } from "date-fns";
import axios from "axios";
import { toZonedTime } from "date-fns-tz";
import { TweetInterface } from "../../context/types";

export const sendAction = async (
  id: number,
  actionDone: boolean,
  action: string,
  tweets: TweetInterface[],
  handleSetTweets: (value: TweetInterface[]) => void,
) => {
  actionDone = !actionDone;

  const field = action === "likes" ? "likes" : "retweets";
  const actionCompletion = action === "likes" ? "liked" : "retweeted";

  try {
    const updatedTweets = tweets.map((tweet) => {
      if (tweet.id === id) {
        return {
          ...tweet,
          [actionCompletion]: actionDone,
          [field]: actionDone
            ? (tweet[field] ?? 0) + 1
            : Math.max(0, (tweet[field] ?? 0) - 1),
        };
      }
      return tweet;
    });

    handleSetTweets(updatedTweets);

    const data = {
      tweetId: id,
    };
    await axios.put("http://localhost:8080/api/tweets/action", data, {
      params: { tweetAction: action },
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.stack);
    } else {
      console.error(error);
    }
  }
};

export const formatTweetDate = (created_at: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tweetDate = toZonedTime(new Date(created_at), userTimeZone);
  const now = new Date();

  if (differenceInHours(now, tweetDate) < 24) {
    return formatDistanceToNowStrict(tweetDate, { addSuffix: false });
  } else {
    return format(tweetDate, "MMM d");
  }
};
