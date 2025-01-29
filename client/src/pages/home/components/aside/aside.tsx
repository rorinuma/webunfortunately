import "./aside.css"
import search from "../../assets/search.svg"

const Aside = () => {

  return (
    <aside id="aside">
      <div className="search-bar">
        <input type="text" placeholder="Search" id="search-input" />
        <div className="search-button-container"><img src={search} alt="search-button" /></div>
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </aside>
  )
}

export default Aside