import { useState } from "react";
import centerMarker from '../../assets/images/cancel-orange.svg'

export default function Card (props) {
  return (
    <div 
    onClick={(e) => {
      e.stopPropagation()
      console.log('選')}}
    className="card">
      <h3 className="card__title">國立台灣科學教育館地下停車場</h3>
      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>牯嶺街95巷107號對面空地</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>02-2748-4522</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>10:30 - 23:59</span>
      </div>

      <div className="card__info">
        <img src={centerMarker} alt="icon"></img>
        <span>30 元/小時</span>
      </div>
    </div>
  )
}