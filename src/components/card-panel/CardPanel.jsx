import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from "react";

import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'

import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPark } from '../../reducer/reducer'


export default function CardPanel () {
  const currentPark = useSelector((state) => state.park.currentPark)
  const nearParks = useSelector((state) => state.park.nearParks)
  const mode = useSelector((state) => state.map.mode)
  const dispatch = useDispatch()
  
  const [isNearActive, setIsNearActive] = useState(false)

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  //網址變化時偵測網址來改變 isActive
  useEffect(() => {
    if (!queryParams.has('nearby')) {
      return setIsNearActive(false)
    }
    if (queryParams.has('nearby') && queryParams.get('nearby') !== 'true') {
      navigate('/not-found', {push: true})
      return setIsNearActive(false)
    }
    if (queryParams.get('nearby') === 'true') {
      return setIsNearActive(true)
    } 
  },[queryParams, navigate]) 

  
  const isCurrentCardOnly = () => {
    if (!nearParks) return true
    if (!currentPark?.id) return false
    return nearParks.some(park => park.id === currentPark.id)
  }

  //子層toggle，父層執行
  const atToggleCard = (park) => {
    //改變網址(先確定有沒有querystring)
    const queryStr = location.search
    navigate(`/map/${park.id}${queryStr}`, {push: true})

    //設定為目前點選的停車場
    dispatch(setCurrentPark(park))
  }



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
        {!currentPark?.id? nearParks?.length? <></> : <div className='card__panel--container-empty'>目前附近沒有停車場</div> : <></>}

        {/* 當currentPark不在nearParks中時就放第一個 */}
        {!isCurrentCardOnly() && currentPark?.id && 
        <Card 
          key={ currentPark.id } 
          park={ currentPark } 
          isCurr={true} 
        />}

        {nearParks && nearParks.map(park => {
          return (
            <Card 
              key={ park.id } 
              park={ park } 
              currentPark={currentPark}
              mode={mode} 
              onToggleCard={atToggleCard}
            />
          )
        })}

      </div>
      <img className="card__panel--icon" src={ Arrow } alt="toggle" />
    </div>

  )
}