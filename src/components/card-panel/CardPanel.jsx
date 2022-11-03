import { useState, useContext } from "react";
import { allContext } from '../../App'
import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'

export default function CardPanel (props) {
  const [isActive, setIsActive] = useState(false)
  const { parkingLots } = useContext(allContext)
  const { currentPark } = props
  //點選中的停車場要放在最上方，傳入 isCurr=true 來給 Card 判斷
  const parksWithoutCurrentPark = parkingLots?.filter(park => park.id !== currentPark?.id)
  
  return (
    <div 
    onClick={() => {setIsActive(!isActive)}}
    className={isActive? 'card__panel active': 'card__panel'}>
      <div className="card__panel--container scroll-bar">

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