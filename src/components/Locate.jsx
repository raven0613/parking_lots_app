import locate from '../assets/images/locate.svg'
import { useContext } from 'react';
// import { allContext } from '../pages/Home'
import { allContext } from '../utils/Provider'

import { useSelector, useDispatch } from 'react-redux'
import { setMode } from '../reducer/reducer'

export default function Locate () {
  const selfPos = useSelector((state) => state.map.selfPos)
  const mode = useSelector((state) => state.map.mode)
  const dispatch = useDispatch()
  
  const { mapInstance, setIsFollow } = useContext(allContext)

  
  const disabled = mode ? '' : 'disabled'

  if (mode !== 'screen-center') {
    return (
      <button 
        onClick={() => {
          if (!setIsFollow) return
          if (!mapInstance) return
          if (!selfPos?.lat) return

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
        className={`locate ${disabled}`}>
        <img src={locate} alt="locate"></img>
      </button>
    )
  }
  return (
    <button 
      onClick={() => {
        dispatch(setMode('self'))
      }} 
      className={`locate ${disabled}`}>
      <img src={locate} alt="locate"></img>
    </button>
  )
}