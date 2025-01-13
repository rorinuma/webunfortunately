import "./header.css"



const Header = () => {

  return (
    <header className="header">
      <div >
        <div className="header-category"><button className="header-btn">For you</button></div>
      </div>
      <div>
        <div className="header-category"><button className="header-btn">Following</button></div>
      </div>
    </header>
  )
}

export default Header