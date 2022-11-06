import { useNavigate } from 'react-router-dom'

export default function ModeController (props) {
  const { setMode } = props
  const navigate = useNavigate()



  return (
    <div className='mode__controller'>
      <button
        className="mode__controller--button mode__controller--self"
        onClick={() => {
          navigate(`/map`, {push: true})
          setMode("self")
        }}>
        自己位置
      </button>
      <button
        className="mode__controller--button mode__controller--quick"
        onClick={() => {
          navigate(`/map`, {push: true})
          setMode("screen-center")
        }}>
        即時搜尋
      </button>
    </div>
  )
}