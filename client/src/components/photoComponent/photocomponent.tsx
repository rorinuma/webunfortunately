import { useParams, Navigate } from "react-router-dom";

const PhotoRedirect = () => {
  const { username, statusNumber } = useParams();
  if (!username || !statusNumber) {
    return null;
  }
  return <Navigate to={`/${username}/status/${statusNumber}`} replace />;
};

export default PhotoRedirect;
