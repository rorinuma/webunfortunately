import { useOutletContext } from "react-router-dom"
import Tweet from "../../../home/components/tweet/tweet"
import { ProfileOutletContextType } from "../../profile";

const Likes = () => {

  const { username } = useOutletContext<ProfileOutletContextType>();
    

  return (
    <Tweet tweetType="liked" username={username} />
  )
}

export default Likes