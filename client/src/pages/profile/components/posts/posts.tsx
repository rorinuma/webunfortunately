import { useOutletContext } from "react-router-dom";
import Tweet from "../../../../components/tweet/tweet"
import { ProfileOutletContextType } from "../../profile";

const Posts = () => {

  const { username } = useOutletContext<ProfileOutletContextType>();

  return (
    <Tweet tweetType="posts" username={username}/>
  )
}

export default Posts