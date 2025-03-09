import "./home.css";
import Nav from "./components/nav/nav";
import { Outlet } from "react-router-dom";
import Aside from "./components/aside/aside";
import { useTweetContext } from "../../context/TweetContext";

interface Props {
  username: string;
  handleLoginStatus: (status: boolean | null) => void;
}

const Home = ({ username, handleLoginStatus }: Props) => {
  const { homeScreenOverlayShown } = useTweetContext();

  return (
    <>
      {homeScreenOverlayShown && <div className="home-screen-overlay"></div>}
      <div className="home-container">
        <Nav username={username} handleLoginStatus={handleLoginStatus} />
        <div className="main-container">
          <div className="main" id="main">
            <div className="wrapuwu" id="wrapuwu">
              <Outlet />
            </div>
            <Aside />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
