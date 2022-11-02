import { useState } from "react";
import centerMarker from '../../assets/images/cancel-orange.svg'


export default function Card (props) {
  const { name, address, tel, serviceTime, payex, availablecar, availablemotor } = props.park

  return (
    <div 
    onClick={(e) => {
      e.stopPropagation()
      console.log('選')}}
    className="card">
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