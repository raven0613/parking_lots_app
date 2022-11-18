import { useNavigate } from 'react-router-dom'

export default function ModeController (props) {
  const { mode, setMode } = props
  const navigate = useNavigate()

  let selfClass = `mode__controller--button mode__controller--self ${mode === 'self' ? 'active' : ''}`
  let screenClass = `mode__controller--button mode__controller--quick ${mode === 'screen-center' ? 'active' : ''}`

  return (
    <div className='mode__controller'>

      <button
        className={selfClass}
        onClick={() => {
          navigate(`/map`, {push: true})
          setMode("self")
        }}>
        <span className='mode__controller--mobile'>自身位置</span>

        <div className='mode__controller--pc'> 
          <p>自</p>
          <p>身</p>
          <p>位</p>
          <p>置</p>
        </div>
      </button>

      <button
        className={screenClass}
        onClick={() => {
          navigate(`/map`, {push: true})
          setMode("screen-center")
        }}>
        <span className='mode__controller--mobile'>地圖搜尋</span>
        <div className='mode__controller--pc'> 
          <p>地</p>
          <p>圖</p>
          <p>搜</p>
          <p>尋</p>
        </div>

      </button>
    </div>
  )
}