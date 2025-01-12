
import "./library.css"

interface Props {
  DATA : {id: number, book: string}[]
}


function Library({DATA} : Props) {


    
  return (
    <div className="library">
      {DATA.map(({id, book}) => (
        <div key={id} className="book-displayed">
          <p>{book}</p>
        </div>
      ))}
    </div>
  )
}

export default Library