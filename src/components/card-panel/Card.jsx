import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import charging from '../../assets/images/charging.svg'
import pregnancy from '../../assets/images/pregnancy.svg'
import availableCarImg from '../../assets/images/detail-car.svg'
import availableMotorImg from '../../assets/images/detail-motor.svg'
import disabled from '../../assets/images/disabled.svg'
import addressImg from '../../assets/images/address.svg'
import payexImg from '../../assets/images/payex.svg'
import serviceTimeImg from '../../assets/images/service-time.svg'
import telImg from '../../assets/images/tel.svg'
import { useState } from "react";



export default function Card (props) {
  const { name, address, tel, service, payex, availablecar, availablemotor, id, Handicap_First, summary, ChargingStation, Pregnancy_First } = props.park
  const { currentPark, isCurr, onToggleCard } = props

  
  const isDisabled = summary?.includes('身心') || Handicap_First > 0
  const isPregnancy = Pregnancy_First > 0

  const [cardClass, setCardClass] = useState('card')


  useEffect(() => {
    if (!currentPark?.id) return
    if (id === currentPark.id) return setCardClass('card current')
    if (id !== currentPark.id) return setCardClass('card')
  }, [currentPark])

  useEffect(() => {
    if (isCurr) return setCardClass('card current')
  }, [isCurr])
  
  return (
    <div 
    onClick={(e) => {
      if (currentPark?.id && id === currentPark.id) return
      e.stopPropagation()
      //執行父層傳來的函式
      onToggleCard(props.park)
    }}
    className={cardClass}>

      <h3 className="card__title">{ name }</h3>
      
      <div className="card__info">
        <img src={payexImg} alt="payex"></img>
        <span>{ payex }</span>
      </div>

      <div className="card__info">
        <img src={serviceTimeImg} alt="serviceTime"></img>
        <span>{ service }</span>
      </div>

      <div className="card__info address">
        <img src={addressImg} alt="address"></img>
        <span>{ address? address : '-' }</span>
      </div>

      <div className="card__info tel">
        <img src={telImg} alt="tel"></img>
        <span>{ tel }</span>
      </div>

      <div className="card__info--bottom">
        <p className="card__info--distance">
          
        </p>

        
        {isPregnancy && <img className="card__info--disabled" src={pregnancy} alt="pregnancy-parking" />}

        {isDisabled && <img className="card__info--disabled" src={disabled} alt="disabled-parking" />}

        {ChargingStation > 0 && <img className="card__info--charging" src={charging} alt="charging" />}

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