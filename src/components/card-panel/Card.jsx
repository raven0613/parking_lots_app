import { useEffect } from "react";
import centerMarker from '../../assets/images/cancel-orange.svg'


export default function Card (props) {
  const { name, address, tel, serviceTime, payex, availablecar, availablemotor } = props.park
  const { isCurr } = props

  const positon = {lng: props.park.lng, lat: props.park.lat}
  
  return (
    <div 
    onClick={(e) => {
      e.stopPropagation()
      if (isCurr) return
      if(!props.onClickSettings) return

      //點擊卡片後呼叫 Map 的建議路線功能+設定為目前點選的停車場
      const { handleFetchDirections, selfPos, directions, setDirections, setCurrentPark } = props.onClickSettings
      handleFetchDirections(selfPos, positon , directions, setDirections)
      setCurrentPark(props.park)}}

    className={isCurr? 'card current' : 'card'}>
      <h3 className="card__title">{ name }</h3>
      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>{ address? address : '-' }</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>{ tel }</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>{ serviceTime }</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span></span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>availablecar: { availablecar }</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>availablemotor: { availablemotor }</span>
      </div>
    </div>
  )
}