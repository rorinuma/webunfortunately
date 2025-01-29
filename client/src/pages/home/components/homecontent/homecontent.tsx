import Header from "../header/header"
import ForYou from "../foryou/foryou"
import Following from "../following/following"
import TweetTextArea from "../../../../components/tweettextarea/tweettextarea"
import "./homecontent.css"
import { Outlet } from "react-router-dom"

interface Props {
  forYouActive: string,
  handleOnForYouActive: () => void,
  followingActive: string,
  handleOnFollowingActive: () => void
}

const HomeContent = ({forYouActive, handleOnForYouActive, followingActive, handleOnFollowingActive} : Props) => {
  return (
    <>
      <Outlet />
      <Header
        forYouActive={forYouActive}
        handleOnForYouActive={handleOnForYouActive}
        followingActive={followingActive}
        handleOnFollowingActive={handleOnFollowingActive}
      />
      <TweetTextArea />
      <div className="home-content">
        {forYouActive === 'active' ? <ForYou /> : <Following />}
      </div>
    </>
  )
}

export default HomeContent