import Header from "../header/header";
import ForYou from "../foryou/foryou";
import Following from "../following/following";
import TweetTextArea from "../../../../components/tweettextarea/tweettextarea";
import "./homecontent.css";

interface Props {
  forYouActive: string;
  handleOnForYouActive: () => void;
  followingActive: string;
  handleOnFollowingActive: () => void;
}

const HomeContent = ({
  forYouActive,
  handleOnForYouActive,
  followingActive,
  handleOnFollowingActive,
}: Props) => {
  return (
    <>
      <Header
        forYouActive={forYouActive}
        handleOnForYouActive={handleOnForYouActive}
        followingActive={followingActive}
        handleOnFollowingActive={handleOnFollowingActive}
      />
      <TweetTextArea placeholder="What is happening?!" />
      <div className="home-content">
        {forYouActive === "active" ? <ForYou /> : <Following />}
      </div>
    </>
  );
};

export default HomeContent;
