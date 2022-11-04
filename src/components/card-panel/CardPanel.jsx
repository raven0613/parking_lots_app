import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useState, useContext, useEffect } from "react";
import { allContext } from '../../App'
import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'

export default function CardPanel (props) {
  const [isActive, setIsActive] = useState(false)
  const { parkingLots } = useContext(allContext)
  const { currentPark } = props
  //點選中的停車場要放在最上方，傳入 isCurr=true 來給 Card 判斷
  const parksWithoutCurrentPark = parkingLots?.filter(park => park.id !== currentPark?.id)

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const params = useParams()
  //parkId存在的話(已經在追蹤某停車場)就放入網址
  const parkId = params.parkId ? `/${params.parkId}` : ''

  //網址變化時偵測網址來改變 isActive
   useEffect(() => {
    if (queryParams.get('nearby')) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
   },[location]) 

  return (
    <div 
    onClick={() => {
      if (!isActive) {
        navigate(`/map${parkId}?nearby=true`, {push: true})
      } else {
        navigate(`/map${parkId}`)
      }
      setIsActive(!isActive)
    }}
    className={isActive? 'card__panel active': 'card__panel'}>
      {/* 裝card的class 點擊後禁止點到後面的 card__panel => 手機版防止點擊 cardPanel 關閉 */}
      <div className="card__panel--container scroll-bar" onClick={(e) => e.stopPropagation()}>

        {currentPark? <Card key={ currentPark.id } park={ currentPark } isCurr={true} /> : <></>}

        {parksWithoutCurrentPark && parksWithoutCurrentPark.map(park => {
          return (
            <Card key={ park.id } park={ park } onClickSettings={props} />
          )
        })}

      </div>
      <img className="card__panel--icon" src={ Arrow } alt="" />
    </div>

  )
}