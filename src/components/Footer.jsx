import { useNavigate, useLocation } from 'react-router-dom'
import mapSearch from '../assets/images/map-search.svg'
import selfSearch from '../assets/images/self-search.svg'
import nearby from '../assets/images/nearby.svg'
// import { allContext } from '../pages/Home'
import { allContext } from '../utils/Provider'
import { useContext } from 'react';


import { useSelector, useDispatch } from 'react-redux'
import { setMode } from '../reducer/reducer'


export default function Footer () {
  const selfPos = useSelector((state) => state.map.selfPos)
  const mode = useSelector((state) => state.map.mode)
  const dispatch = useDispatch()

  const { setIsFollow, mapInstance, isNearActive, setIsNearActive } = useContext(allContext)

  let selfClass = `footer__btn ${mode === 'self' ? '' : ''}`
  let screenClass = `footer__btn ${isNearActive ? '' : 'active'}`
  let nearclass = `footer__btn ${isNearActive ? 'active' : ''}`

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  return (
    <footer className='footer'>
      <div 
        onClick={() => {
          const currPath = location.pathname
          navigate(`${currPath}`, {push: true})
          //改成只是把cardPanel關掉，原本有點選卡片的話要保留
          setIsNearActive(false)
        }} 
        className={screenClass}>
        <img src={mapSearch} alt="map-search"></img>
        <p>地圖</p>
      </div>
      <div         
        onClick={() => {
          if(mode !== 'screen-center') {
            if (!setIsFollow) return
            if (!mapInstance) return

            setIsFollow(true)
            //一旦移動了就不跟隨，按下locate後恢復跟隨
            //定位到user身上
            if (!mapInstance.map) {
              mapInstance.setZoom(15)
              return mapInstance.panTo(selfPos)
            }
            mapInstance.map.setZoom(15)
            mapInstance.map.panTo(selfPos)
          }
          navigate(`${location.pathname}`, {push: true})
          dispatch(setMode("self"))
        }} 
      className={selfClass}>
        <img src={selfSearch} alt="self-search"></img>
        <p>定位</p>
      </div>
      <div 
        onClick={() => {
          if (isNearActive) return
          const currPath = location.pathname
          queryParams.append('nearby', 'true') //把 queryParams 增加 nearby=true
          navigate(`${currPath}?${queryParams}`, {push: true})
          setIsNearActive(true)
        }}
        className={nearclass}>
        <img src={nearby} alt="nearby"></img>
        <p>附近停車場</p>
      </div>
    </footer>
  )
}