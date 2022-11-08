import { useNavigate, useLocation } from 'react-router-dom'
import mapSearch from '../assets/images/map-search.svg'
import selfSearch from '../assets/images/self-search.svg'
import nearby from '../assets/images/nearby.svg'
import { allContext } from '../pages/Home'
import { useContext } from 'react';

export default function Footer (props) {
  const { isNearActive, setIsNearActive } = props
  const { mode, setMode, setIsFollow } = useContext(allContext)

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
          navigate(`/map`, {push: true})
          // setMode("screen-center")
          //改成只是把cardPanel關掉
          setIsNearActive(false)
        }} 
        className={screenClass}>
        <img src={mapSearch} alt="map-search"></img>
        <p>地圖</p>
      </div>
      <div         
        onClick={() => {
          navigate(`/map`, {push: true})
          setMode("self")
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