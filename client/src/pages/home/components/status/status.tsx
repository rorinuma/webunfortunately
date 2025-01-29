import { useEffect } from "react"

const Status = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>Status</div>
  )
}

export default Status