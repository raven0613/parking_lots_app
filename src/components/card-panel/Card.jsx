import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import availableCarImg from '../../assets/images/detail-car.svg'
import availableMotorImg from '../../assets/images/detail-motor.svg'
import disabled from '../../assets/images/disabled.svg'
import addressImg from '../../assets/images/address.svg'
import payexImg from '../../assets/images/payex.svg'
import serviceTimeImg from '../../assets/images/service-time.svg'
import telImg from '../../assets/images/tel.svg'



export default function Card (props) {
  const { name, address, tel, serviceTime, payex, availablecar, availablemotor, id, Handicap_First, summary } = props.park
  const { isCurr, setCurrentPark, setCanFetchDirection, mode } = props

  const positon = {lng: props.park.lng, lat: props.park.lat}
  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const isDisabled = summary.includes('身心') || Handicap_First > 0
  const travelTime = mode === 'self' ? '預計 5 分鐘內' : `預計 ? 分鐘`

  return (
    <div 
    onClick={(e) => {
      e.stopPropagation()
      if (isCurr) return console.log('已經點選')
      
      //改變網址(先確定有沒有開啟nearby)
      const queryStr = location.search
      navigate(`/map/${id}${queryStr}`, {push: true})

      //點擊卡片後呼叫 Map 的建議路線功能+設定為目前點選的停車場
      setCurrentPark(props.park)
      // setCanFetchDirection(true)
    }}
    className={isCurr? 'card current' : 'card'}>
      <h3 className="card__title">{ name }</h3>
      
      {isCurr && <div className="card__info">
        <img src={addressImg} alt="address"></img>
        <span>{ address? address : '-' }</span>
      </div> }

      {isCurr && <div className="card__info">
        <img src={telImg} alt="tel"></img>
        <span>{ tel }</span>
      </div> }

      {isCurr && <div className="card__info">
        <img src={serviceTimeImg} alt="serviceTime"></img>
        <span>{ serviceTime }</span>
      </div> }

      <div className="card__info">
        <img src={payexImg} alt="payex"></img>
        <span>{ payex }</span>
      </div>

      <div className="card__info--bottom">
        <p className="card__info--distance">
          {travelTime}
        </p>

        {isDisabled && <img className="card__info--disabled" src={disabled} alt="disabled-parking" />}

        <div className="card__info--avai">
          <img src={availableCarImg} alt="availableCar"></img>
          <span>{ availablecar }</span>
        </div>
        <div className="card__info--avai">
          <img src={availableMotorImg} alt="availablemotor"></img>
          <span>{ availablemotor }</span>
        </div>
      </div>
    </div>
  )
}