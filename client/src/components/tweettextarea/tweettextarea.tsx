import Pfp from "../../assets/placeholderpfp.jpg"
import TextareaAutosize from "react-textarea-autosize";
import img from "../../assets/image.svg"
import ballot from "../../assets/ballot.svg"
import emoji from "../../assets/emoji.svg"
import gif from "../../assets/gif.svg"
import hospital from "../../assets/hospital.svg"
import location from "../../assets/location.svg"
import schedule from "../../assets/schedule.svg"
import { useState, useRef, useEffect } from "react";
import axios from "axios"
import "./tweettextarea.css"

interface Props {
  postButtonActive?: boolean,
}

const TweetTextArea = ({ postButtonActive} : Props) => {
  const [ tweetValue, setTweetValue ] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [ imgInput, setImgInput ] = useState<File | null>(null)
  const [ imgUrl, setImgUrl] = useState('')

  const handleTweetValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTweetValue(e.target.value)
  }

  useEffect(() => {
    if(!postButtonActive) {
      setTweetValue('')
      setImgInput(null)
      setImgUrl('')
    }
  }, [postButtonActive])
  
  const isBtnDisabled = tweetValue.trim().length === 0 && imgInput === null
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

  const handleImageRemoval = () => {
    setImgUrl('')
    setImgInput(null)
  }

  return (
    <form className="tweet-post-container" action="http://localhost:8080/api/tweets" encType={'multipart/form-data'} onSubmit={handleTweetPost}>
      <div className="tweet-post-pfp"><img src={Pfp} alt="post-pfp"/></div>
      <div className="tweet-area-post-container">
        <div className="tweet-area-container">
          <TextareaAutosize
            className="tweet-area"
            placeholder="What is happening?!" 
            value={tweetValue} 
            onChange={handleTweetValueChange}
          />
          <div className="tweet-post-image-container">
            {imgUrl && <div className="image-edit"><button>Edit</button></div>}
            {imgUrl && <div className="image-delete"><button onClick={handleImageRemoval}>X</button></div>}
            <div> 
              {imgUrl && (<img src={imgUrl} alt="tweet-post-image" className="tweet-post-image" />)}
            </div>
          </div>
        </div>
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
  )
}

export default TweetTextArea