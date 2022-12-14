import { ReactComponent as LocateIcon } from '../../assets/images/locate.svg'
import { useContext } from 'react';
import { mapContext } from '../../store/UIDataProvider'

import { useSelector, useDispatch } from 'react-redux'
import { setMode, setIsFollow, setWarningMsg } from '../../reducer/reducer'

export default function Locate () {
  const selfPos = useSelector((state) => state.map.selfPos)
  const mode = useSelector((state) => state.map.mode)
  const isLocateDenied = useSelector((state) => state.map.isLocateDenied)
  const dispatch = useDispatch()
  
  const { mapInstance } = useContext(mapContext)

  
  const disabled = mode ? '' : 'disabled'

  if (mode !== 'screen-center') {
    return (
      <button 
        onClick={() => {
          if (!selfPos?.lat) return
          if (!setIsFollow) return
          if (!mapInstance) return
          

          dispatch(setIsFollow(true))
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
        <LocateIcon className='icon' alt="locate"></LocateIcon>
      </button>
    )
  }
  return (
    <button 
      onClick={() => {
        if (isLocateDenied) {
          dispatch(setWarningMsg('您無法使用定位及路線功能，可於瀏覽器設定開啟權限。'))
          return
        }
        
        dispatch(setMode('self'))
      }} 
      className={`locate ${disabled}`}>
      <LocateIcon className='icon' alt="locate"></LocateIcon>
    </button>
  )
}