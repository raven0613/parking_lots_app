import { useState } from "react";
import Card from './Card'
import Arrow from '../../assets/images/card-panel-arrow.svg'

export default function CardPanel () {
  const [isActive, setIsActive] = useState(false)
  return (
    <div 
    onClick={() => {setIsActive(!isActive)}}
    className={isActive? 'card__panel active': 'card__panel'}>
      <div className="card__panel--container scroll-bar">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      
      {/* 放附近停車場卡片 */}

      <img className="card__panel--icon" src={Arrow} alt="" />
    </div>
  )
}