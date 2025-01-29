import { useContext, useEffect } from "react"
import { OverlayContext } from "./OverlayContext"
import { useParams } from "react-router-dom"
import StatusOverlay from "../../pages/home/components/statusoverlay/statusoverlay"

const OverlayRenderer = () => {


  const overlayContext = useContext(OverlayContext)

  if(!overlayContext) throw new Error('baka')

  const { overlayContent, isOverlayVisible } = overlayContext

  if(!isOverlayVisible || !overlayContent) {
    return null
  }

  const { statusNumber, username } = useParams<{statusNumber?: string; username?: string}>()
  const { setIsOverlayVisible, setOverlayContent } = overlayContext

  useEffect(() => {
    if (statusNumber && username) {
      setIsOverlayVisible(true);
      setOverlayContent({content: <StatusOverlay />, statusNumber: statusNumber, username: username});
    } else {
      setIsOverlayVisible(false);
      setOverlayContent(null);
    }
  }, [statusNumber, username]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOverlayVisible(false);
      setOverlayContent(null);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  return (
    <>
      <StatusOverlay />
    </>
  )
}

export default OverlayRenderer