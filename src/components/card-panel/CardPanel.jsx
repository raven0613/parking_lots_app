import { useState, useContext } from "react";
import { allContext } from '../../App'
import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'
import { useEffect } from "react";

export default function CardPanel () {
  const [isActive, setIsActive] = useState(false)
  const { parkingLots, setParkingLots } = useContext(allContext)


  return (
    <div 
    onClick={() => {setIsActive(!isActive)}}
    className={isActive? 'card__panel active': 'card__panel'}>
      <div className="card__panel--container scroll-bar">
        {parkingLots && parkingLots.map(park => {
          return (
            <Card key={ park.id } park={ park }/>
          )
        })}
      </div>
      <img className="card__panel--icon" src={ Arrow } alt="" />
    </div>
  )
}