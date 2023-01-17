import { useEffect } from "react";

import { ReactComponent as AvailableCar } from '../../assets/images/detail-car.svg'
import { ReactComponent as AvailableMotor } from '../../assets/images/detail-motor.svg'
import { ReactComponent as Disabled } from '../../assets/images/disabled.svg'
import { ReactComponent as Pregnancy } from '../../assets/images/pregnancy.svg'
import { ReactComponent as Charging } from '../../assets/images/charging.svg'
import { ReactComponent as Address } from '../../assets/images/address.svg'
import { ReactComponent as Payex } from '../../assets/images/payex.svg'
import { ReactComponent as ServiceTime } from '../../assets/images/service-time.svg'
import { ReactComponent as Tel } from '../../assets/images/tel.svg'

import { ReactComponent as Sunny } from '../../assets/images/weather-sunny.svg'
import { ReactComponent as SunCloudy } from '../../assets/images/weather-sun_cloudy.svg'
import { ReactComponent as Cloudy } from '../../assets/images/weather-cloudy.svg'
import { ReactComponent as Fog } from '../../assets/images/weather-fog.svg'
import { ReactComponent as Rain } from '../../assets/images/weather-rain.svg'
import { ReactComponent as ThunderRain } from '../../assets/images/weather-thunder_rain.svg'

import { useState } from "react";

const weatherFilter = (weather) => {
  if (weather.includes('雷')) return (<ThunderRain className="card__info--weather" alt="weather-thunder" />)
  if (weather.includes('雨')) return (<Rain className="card__info--weather" alt="weather-rainy" />)
  if (weather === '晴時多雲' || weather === '多雲時晴') return (<SunCloudy className="card__info--weather" alt="weather-sunny-cloudy" />)
  if (weather.includes('霧')) return (<Fog className="card__info--weather" alt="weather-foggy" />)
  if (weather.includes('雲')) return (<Cloudy className="card__info--weather" alt="weather-cloudy" />)
  if (weather.includes('陰')) return (<Cloudy className="card__info--weather" alt="weather-cloudy" />)
  if (weather.includes('晴')) return (<Sunny className="card__info--weather" alt="weather-sunny" />)
  return '雲'
}

export default function Card (props) {
  const { name, address, tel, service, payex, availablecar, availablemotor, id, Handicap_First, summary, ChargingStation, Pregnancy_First, weather } = props.park
  const { currentPark, isCurr, onToggleCard } = props

  
  const isDisabled = summary?.includes('身障') || summary?.includes('身心') || Number(Handicap_First) > 0
  const isPregnancy = Number(Pregnancy_First) > 0

  const [cardClass, setCardClass] = useState('card')


  useEffect(() => {
    if (!currentPark?.id) return
    if (id === currentPark.id) return setCardClass('card current')
    if (id !== currentPark.id) return setCardClass('card')
  }, [currentPark, id])

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
        <Payex className="icon" alt="payex" />
        <span>{ payex }</span>
      </div>

      <div className="card__info">
        <ServiceTime className="icon" alt="serviceTime" />
        <span>{ service }</span>
      </div>

      <div className="card__info address">
        <Address className="icon" alt="address" />
        <span>{ address? address : '-' }</span>
      </div>

      <div className="card__info tel">
        <Tel className="icon" alt="tel" />
        <span>{ tel }</span>
      </div>

      <div className="card__info--bottom">
        {weatherFilter(weather)}

        {isPregnancy && <Pregnancy className="card__info--disabled" alt="pregnancy-parking" />}


        {isDisabled && <Disabled className="card__info--disabled" alt="disabled-parking" />}

        {ChargingStation > 0 && <Charging className="card__info--charging" alt="charging" />}

        <div className="card__info--avai">
          <AvailableCar className="img" alt="availableCar"/>
          <span>{ availablecar }</span>
        </div>
        <div className="card__info--avai">
          <AvailableMotor className="img" alt="availablemotor"/>
          <span>{ availablemotor }</span>
        </div>
      </div>
    </div>
  )
}