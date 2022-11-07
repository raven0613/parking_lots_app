import locate from '../assets/images/locate.svg'

export default function Locate ({selfPos, mapInstance, mode, setMode, setIsFollow}) {

  if (mode !== 'screen-center') {
    return (
      <button 
        onClick={() => {
          setIsFollow(true)
          //一旦移動了就不跟隨，按下locate後恢復跟隨
          //定位到user身上
          if (!mapInstance.map) {
            mapInstance.setZoom(15)
            return mapInstance.panTo(selfPos)
          }
          mapInstance.map.setZoom(15)
          mapInstance.map.panTo(selfPos)
          //setCenter 或 panTo(較滑順)
        }} 
        className="locate">
        <img src={locate} alt="locate"></img>
      </button>
    )
  }
  return (
    <button 
      onClick={() => {
        setMode('self')
      }} 
      className="locate">
      <img src={locate} alt="locate"></img>
    </button>
  )
}