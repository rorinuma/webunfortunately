import "./App.css";
import Loading from "./pages/loading/loading";
import Login from "./pages/title/components/login/Login";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUp from "./pages/title/components/signup/SignUp";
import axios from "axios";
import Home from "./pages/home/home";
import Notifications from "./pages/home/components/notifications/notifications";
import HomeContent from "./pages/home/components/homecontent/homecontent";
import Profile from "./pages/profile/profile";
import { useEffect, useState } from "react";
import Posts from "./pages/profile/components/posts/posts";
import Replies from "./pages/profile/components/replies/replies";
import Hightlights from "./pages/profile/components/highlights/hightlights";
import Articles from "./pages/profile/components/articles/articles";
import Media from "./pages/profile/components/media/media";
import Likes from "./pages/profile/components/likes/likes";
import StatusOverlay from "./pages/home/components/statusoverlay/statusoverlay";
import Status from "./pages/home/components/status/status";
import { TweetProvider } from "./context/TweetContext";
import Post from "./pages/home/components/post/Post";
import NotFound from "./pages/home/components/notfound/NotFound";
import PhotoRedirect from "./components/photoComponent/photocomponent";
import Title from "./pages/title/Title";

const App = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [forYouActive, setForYouActive] = useState("active");
  const [followingActive, setFollowingActive] = useState("disablied");
  const location = useLocation();
  const previousLocation = location.state?.background;

  const handleLoginStatus = (status: boolean | null) => {
    setLoggedIn(status);
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/protected",
          { withCredentials: true },
        );
        if (response.status === 200) {
          setUsername(response.data.user.username);
          setLoggedIn(true);
        }
      } catch (err) {
        console.error("an error ocurred while checking the login", err);
        setLoggedIn(false);
      }
    };
    checkLogin();
  }, [loggedIn]);

  const handleOnForYouActive = () => {
    setForYouActive("active");
    setFollowingActive("disabled");
  };

  const handleOnFollowingActive = () => {
    setForYouActive("disabled");
    setFollowingActive("active");
  };

  return (
    <TweetProvider>
      <Routes location={previousLocation || location}>
        {loggedIn === null ? (
          <Route path="*" element={<Loading />} />
        ) : loggedIn ? (
          <>
            <Route
              path="/"
              element={
                <Home
                  username={username}
                  handleLoginStatus={handleLoginStatus}
                />
              }
            >
              <Route
                index
                element={
                  <HomeContent
                    forYouActive={forYouActive}
                    handleOnForYouActive={handleOnForYouActive}
                    followingActive={followingActive}
                    handleOnFollowingActive={handleOnFollowingActive}
                  />
                }
              />
              <Route path=":username" element={<Profile />}>
                <Route index element={<Posts />} />
                <Route path="with_replies" element={<Replies />} />
                <Route path="highlights" element={<Hightlights />} />
                <Route path="articles" element={<Articles />} />
                <Route path="media" element={<Media />} />
                <Route path="likes" element={<Likes />} />
              </Route>
              {!previousLocation && (
                <Route
                  path="/:username/status/:statusNumber/photo/:photoId"
                  element={<PhotoRedirect />}
                />
              )}
              <Route
                path="/:username/status/:statusNumber"
                element={<Status />}
              />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Title />} />
          </>
        )}
      </Routes>
      {!loggedIn && (
        <Routes>
          <Route
            path="/login"
            element={<Login handleLoginStatus={handleLoginStatus} />}
          />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      )}
      {previousLocation && (
        <Routes>
          <Route
            path="/:username/status/:statusNumber/photo/:photoId"
            element={<StatusOverlay />}
          />
          <Route path="/compose/post" element={<Post />} />
        </Routes>
      )}
    </TweetProvider>
  );
};

export default App;
