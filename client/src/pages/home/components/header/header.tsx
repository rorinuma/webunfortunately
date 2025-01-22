import "./header.css"
import TweetTextArea from "../../../../components/tweettextarea/tweettextarea"


interface Props {
  forYouActive: string;
  followingActive: string;
  handleOnFollowingActive: () => void;
  handleOnForYouActive: () => void;
}  

const Header = ({forYouActive, followingActive, handleOnFollowingActive, handleOnForYouActive} : Props) => { 

  return (
    <>
      <header className="header">
        <div className="header-category-container">
          <div className="header-category">
            <button className='header-btn' onClick={handleOnForYouActive}>
              <div className="header-category-text-container" >
                  <div>For you</div>
                  <div>
                    <div className={forYouActive}></div>
                  </div>
              </div>
            </button>
          </div>
        </div>
        <div className="header-category-container">
          <div className="header-category">
            <button className='header-btn' onClick={handleOnFollowingActive}>
              <div className="header-category-text-container">
                <div>Following</div>
                <div>
                  <div className={followingActive}></div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>
      <TweetTextArea />
    </>
  )
}

export default Header