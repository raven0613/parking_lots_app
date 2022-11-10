import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useState, useContext, useEffect } from "react";
import { allContext } from '../../pages/Home'
import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'




export default function CardPanel (props) {
  const { nearParks, setCurrentPark, currentPark, setCanFetchDirection, selfPos, mode  } = useContext(allContext)
  const { setIsNearActive, isNearActive } = props
  //點選中的停車場要放在最上方，傳入 isCurr=true 來給 Card 判斷
  const parksWithoutCurrentPark = nearParks?.filter(park => park.id !== currentPark?.id)

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  //網址變化時偵測網址來改變 isActive
   useEffect(() => {
    if (!queryParams.has('nearby')) {
      return setIsNearActive(false)
    }
    if (queryParams.has('nearby') && queryParams.get('nearby') !== 'true') {
      console.log('404')
      return setIsNearActive(false)
    }
    if (queryParams.get('nearby') === 'true') {
      return setIsNearActive(true)
    } 
   },[location]) 
  return (
    <div 
    onClick={() => {
      const currPath = location.pathname
      if (!isNearActive) {   //打開
        queryParams.append('nearby', 'true') //把 queryParams 增加 nearby=true
      } else {   //關掉
        queryParams.delete('nearby') //把 queryParams 增加 nearby=true
      }
      navigate(`${currPath}?${queryParams}`, {push: true})
      setIsNearActive(!isNearActive)
    }}
    className={isNearActive? 'card__panel active': 'card__panel'}>
      {/* 裝card的class 點擊後禁止點到後面的 card__panel => 手機版防止點擊 cardPanel 關閉 */}
      <div className="card__panel--container scroll-bar" 
        onClick={(e) => e.stopPropagation()}>
        
        {/* 都沒有的話就顯示提示 */}
        {!currentPark? nearParks?.length? <></> : <div className='card__panel--container-empty'>目前附近沒有停車場</div> : <></>}

        {/* {currentPark? <Card 
        key={ currentPark.id } 
        park={ currentPark } 
        isCurr={true} 
        /> : <></>} */}
  
        {/* {parksWithoutCurrentPark && parksWithoutCurrentPark.map(park => {
          return (
            <Card 
            key={ park.id } 
            park={ park } 
            setCurrentPark={setCurrentPark}
            setCanFetchDirection={setCanFetchDirection}
            mode={mode} />
          )
        })} */}
        {nearParks && nearParks.map(park => {
          return (
            <Card 
            key={ park.id } 
            park={ park } 
            currentPark={currentPark}
            setCurrentPark={setCurrentPark}
            mode={mode} />
          )
        })}

      </div>
      <img className="card__panel--icon" src={ Arrow } alt="toggle" />
    </div>

  )
}