import "./header.css"
import AddSvg from "../../assets/add.svg"
import { useRef } from "react"



const Header = () => {

  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputFileRef.current?.click()
  }

  

  return (
    <header className="header">
      <div><h2>One of the things unknown to mankind</h2></div>
      <div>
        <form action="/user-books" method="post" encType="multipart/form-data" >
          <button type="button" className="add-button"><img src={AddSvg} alt="add-icon" onClick={handleClick} /></button>
          <input type="file" accept=".epub" name="book" id="book-upload" ref={inputFileRef} hidden />
        </form>
      </div>
    </header>
  )
}

export default Header