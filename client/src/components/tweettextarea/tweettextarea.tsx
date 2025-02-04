import Pfp from "../../assets/placeholderpfp.jpg"
import TextareaAutosize from "react-textarea-autosize";
import { IoImagesOutline } from "react-icons/io5";
import { MdOutlinePoll } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineGifBox } from "react-icons/md";
import { LiaChairSolid } from "react-icons/lia";
import { IoLocationOutline } from "react-icons/io5";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import axios from "axios"
import "./tweettextarea.css"
import { IconContext } from "react-icons";
import { useTweetContext } from "../../context/TweetContext";

interface Props {
  postButtonActive?: boolean,
  placeholder: string,
  replyClicked?: number | null,
}

const TweetTextArea = ({ postButtonActive, placeholder, replyClicked} : Props) => {
  const [ tweetValue, setTweetValue ] = useState('')
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [ imgInput, setImgInput ] = useState<File | null>(null)
  const [ imgUrl, setImgUrl] = useState('')

  const { tweet } = useTweetContext()

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
      formData.append("text", tweetValue)
      if(imgInput) {
        formData.append('tweet_post_image', imgInput)
      }
      if(replyClicked) {
        formData.append('id', replyClicked.toString())
      } else if (tweet && tweet.id) {
        formData.append('id', tweet.id.toString())
      }

      const response = await axios.post('http://localhost:8080/api/tweets', formData, {
        withCredentials: true,
        headers: {
        "Content-Type": 'multipart/form-data'
        }
      })
      console.log('tweet/reply sent!', response.data)

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
            placeholder={placeholder}
            value={tweetValue} 
            onChange={handleTweetValueChange}
          />
          <div className="tweet-post-image-container">
              {imgUrl && 
              <div>
                <img src={imgUrl} alt="tweet-post-image" className="tweet-post-image" />
                <div className="tweet-post-image-buttons">
                  <div className="image-edit"><button>Edit</button></div>
                  <div className="image-delete"><button onClick={handleImageRemoval}>X</button></div>
                </div>
              </div>
              }
          </div>
        </div>
        <div className="everyone-can-reply">Everyone can reply</div>
        <div className="post-insert-data">
          <div className="post-insert-data-select">
            <IconContext.Provider value={{className: "tweet-area-images"}}>
              <button className="image-select-btn" type="button" onClick={handleImageBtnClick}>
                <IoImagesOutline />
              </button>
              <input type="file" accept="image/*" name="tweet_post_image" onChange={handleImageUpload} ref={imgInputRef} hidden/>
              <button type="button" className="image-select-btn">
                <MdOutlineGifBox />
              </button>
              <button type="button" className="image-select-btn">
                <LiaChairSolid />
              </button>
              <button type="button" className="image-select-btn">
                <MdOutlinePoll />
              </button>
              <button type="button" className="image-select-btn">
                <BsEmojiSmile />
              </button>
              <button type="button" className="image-select-btn">
                <RiCalendarScheduleLine />
              </button>
              <button type="button" className="image-select-btn">
                <IoLocationOutline />
              </button>
            </IconContext.Provider>
          </div>
          <div><button className="tweet-post-btn" disabled={isBtnDisabled}>Post</button></div>
        </div>
      </div>
    </form>
  )
}

export default TweetTextArea