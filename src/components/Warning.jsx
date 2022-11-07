import warning from '../assets/images/warning.svg'
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'

export default function Warning ({ currentPark, transOption, setCurrentPark }) {
  const [isCarEnough, setIsCarEnough] = useState(true)
  const [isMotorEnough, setIsMotorEnough] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)

  let content = '您的目標停車場已無剩餘車位'
  let buttonContent = '重新尋找'

  if (transOption === 'car') {
    if (currentPark && currentPark.totalcar < 1) {
      content = '您的目標停車場無汽車停車格'
    }
  } 
  else if (transOption === 'motor') {
    if (currentPark && currentPark.totalmotor < 1) {
      content = '您的目標停車場無機車停車格'
    }
  }

  useEffect(() => {
    if (!currentPark) return
    if (transOption === 'car') {
      if (currentPark.availablecar < 1) {
        return setIsCarEnough(false)
      }
      return setIsCarEnough(true)
    } 
    else if (transOption === 'motor') {
      if (currentPark.availablemotor < 1) {
        return setIsMotorEnough(false)
      }
      return setIsMotorEnough(true)
    }
  }, [currentPark, transOption])


  if(!isCarEnough || !isMotorEnough) {
    return (
      <div className="warning">
        <div className="warning__content">
          <img src={warning} alt="warning" />
          <p>{content}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            //關掉視窗
            setIsMotorEnough(true)
            setIsCarEnough(true)
            //關掉導航
            //是target模式的話重新就目標找一次
            //是screen模式的話就重進screen模式
            //self模式的話center回到中心
            //關掉目前搜尋的
            setCurrentPark(null)
            const queryStr = location.search
            navigate(`/map/${queryStr}`, {push: true})
          }}
          className="warning__btn">{buttonContent}</button>
      </div>
    )
  }

}