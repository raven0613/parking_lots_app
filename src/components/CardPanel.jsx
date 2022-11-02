import { useState } from "react";

export default function CardPanel () {
  const [isActive, setIsActive] = useState(false)
  return (
    <div 
    onClick={() => {setIsActive(!isActive)}}
    className={isActive? 'card__panel active': 'card__panel'}>
      {/* 放附近停車場卡片 */}
    </div>
  )
}