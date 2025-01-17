import "./header.css"
import React, {  useRef, useState } from "react";
import Pfp from "../../../../assets/placeholderpfp.jpg"
import TextareaAutosize from "react-textarea-autosize";
import img from "../../assets/image.svg"
import ballot from "../../assets/ballot.svg"
import emoji from "../../assets/emoji.svg"
import gif from "../../assets/gif.svg"
import hospital from "../../assets/hospital.svg"
import location from "../../assets/location.svg"
import schedule from "../../assets/schedule.svg"
import axios from "axios"


interface Props {
  forYouActive: string;
  followingActive: string;
  handleOnFollowingActive: () => void;
  handleOnForYouActive: () => void;
}  

const Header = ({forYouActive, followingActive, handleOnFollowingActive, handleOnForYouActive} : Props) => { 
  const [ tweetValue, setTweetValue ] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [ imgInput, setImgInput ] = useState<File | null>(null)
  const [ imgUrl, setImgUrl] = useState('')


  const handleTweetValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetValue(e.target.value)
  }

  const isBtnDisabled = tweetValue.trim().length === 0

  const handleImageBtnClick = () => {
    if(imgInputRef.current) {
      imgInputRef.current.click()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target && e.target.files) {
      const file = e.target.files[0]
      setImgInput(file)
      const fileUrl = URL.createObjectURL(file)
      setImgUrl(fileUrl)
    }
  }


  const handleTweetPost = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("date", Date.now().toString())
      formData.append("text", tweetValue)
      if(imgInput) {
        formData.append('tweet_post_image', imgInput)
      }
      const response = await axios.post('http://localhost:8080/api/tweets', formData, {
        withCredentials: true,
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      })
      console.log('tweet posted successfully', response.data)
      setTweetValue('')
      setImgInput(null)
      setImgUrl('')

    } catch (error) {
      console.error(error)
    }
  }







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
      <form className="tweet-post-container" action="http://localhost:8080/api/tweets" encType={'multipart/form-data'} onSubmit={handleTweetPost}>
        <div className="tweet-post-pfp"><img src={Pfp} alt="post-pfp"/></div>
        <div className="tweet-area-post-container">
          <TextareaAutosize
          className="tweet-area"
          placeholder="What is happening?!" 
          value={tweetValue} 
          onChange={handleTweetValueChange}
          />
          {imgUrl && (<img src={imgUrl} alt="tweet-post-image" className="tweet-post-image" />)}
          <div className="everyone-can-reply">Everyone can reply</div>
          <div className="post-insert-data">
            <div className="post-insert-data-select">
              <button className="image-select-btn" type="button">
                <img src={img} onClick={handleImageBtnClick} alt="image-select" className="img"/>
              </button>
              <input type="file" accept="image/*" name="tweet_post_image" onChange={handleImageUpload} ref={imgInputRef} hidden/>
              <button type="button" className="image-select-btn">
                <img src={gif} alt="image-select" className="img" />
              </button>
              <button type="button" className="image-select-btn">
                <img src={hospital} alt="image-select" className="img" />
              </button>
              <button type="button" className="image-select-btn">
                <img src={ballot} alt="image-select" className="img" />
              </button>
              <button type="button" className="image-select-btn">
                <img src={emoji} alt="image-select" className="img" />
              </button>
              <button type="button" className="image-select-btn">
                <img src={schedule} alt="image-select" className="img" />
              </button>
              <button type="button" className="image-select-btn">
                <img src={location} alt="image-select" className="img" />
              </button>
            </div>
            <div><button className="tweet-post-btn" disabled={isBtnDisabled}>Post</button></div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Header