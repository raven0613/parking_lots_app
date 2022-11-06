import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useState, useContext, useEffect } from "react";
import { allContext } from '../../App'
import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'

export default function CardPanel (props) {
  const [isActive, setIsActive] = useState(false)
  const { nearParks } = useContext(allContext)
  const { setCurrentPark, currentPark, setCanFetchDirection } = props
  //點選中的停車場要放在最上方，傳入 isCurr=true 來給 Card 判斷
  const parksWithoutCurrentPark = nearParks?.filter(park => park.id !== currentPark?.id)

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  // const params = useParams()
  //parkId存在的話(已經在追蹤某停車場)就放入網址
  // const parkId = params.parkId ? `/${params.parkId}` : ''

  //網址變化時偵測網址來改變 isActive
   useEffect(() => {
    console.log(location.pathname)
    if (queryParams.get('nearby')) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
   },[location]) 

  return (
    <div 
    onClick={() => {
      const currPath = location.pathname
      if (!isActive) {   //打開
        queryParams.append('nearby', 'true') //把 queryParams 增加 nearby=true
      } else {   //關掉
        queryParams.delete('nearby') //把 queryParams 增加 nearby=true
      }
      navigate(`${currPath}?${queryParams}`, {push: true})
      setIsActive(!isActive)
    }}
    className={isActive? 'card__panel active': 'card__panel'}>
      {/* 裝card的class 點擊後禁止點到後面的 card__panel => 手機版防止點擊 cardPanel 關閉 */}
      <div className="card__panel--container scroll-bar" onClick={(e) => e.stopPropagation()}>

        {currentPark? <Card 
        key={ currentPark.id } 
        park={ currentPark } 
        isCurr={true} 
        /> : <></>}

        {parksWithoutCurrentPark && parksWithoutCurrentPark.map(park => {
          return (
            <Card 
            key={ park.id } 
            park={ park } 
            setCurrentPark={setCurrentPark}
            setCanFetchDirection={setCanFetchDirection} />
          )
        })}

      </div>
      <img className="card__panel--icon" src={ Arrow } alt="" />
    </div>

  )
}