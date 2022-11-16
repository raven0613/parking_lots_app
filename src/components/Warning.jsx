import warning from '../assets/images/warning.svg'
import { useEffect, useState, useContext } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPark, setIsEmptyId, setWarningMsg } from '../reducer/reducer'


export default function Warning () {
  const warningMsg = useSelector((state) => state.UI.warningMsg)
  const currentPark = useSelector((state) => state.park.currentPark)
  const transOption = useSelector((state) => state.park.transOption)
  const isEmptyId = useSelector((state) => state.park.isEmptyId)
  const dispatch = useDispatch()
  
  const [isCarEnough, setIsCarEnough] = useState(true)
  const [isMotorEnough, setIsMotorEnough] = useState(true)
  const [isActive, setIsActive] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  // const queryParams = new URLSearchParams(location.search)

  //提醒內容（為了讓往關閉跑動畫時也有字）
  const contentRef = useRef(warningMsg)

  // if (currentPark?.availablecar < 1) {
  //   contentRef.current = '您的目標停車場已無剩餘車位'
  // }
  // if (transOption === 'car') {
  //   if (currentPark?.totalcar < 1) {
  //     contentRef.current = '您的目標停車場無汽車停車格'
  //   }
  // } 
  // else if (transOption === 'motor') {
  //   if (currentPark?.totalmotor < 1) {
  //     contentRef.current = '您的目標停車場無機車停車格'
  //   }
  // }
  // if (isEmptyId) {
  //   contentRef.current = '查無此停車場'
  // }

  // useEffect(() => {
  //   if (!currentPark?.id) return

  //   if (transOption === 'car') {
  //     if (currentPark.availablecar < 1) {
  //       return setIsCarEnough(false)
  //     }
  //     return setIsCarEnough(true)
  //   } 
  //   else if (transOption === 'motor') {
  //     if (currentPark.availablemotor < 1) {
  //       return setIsMotorEnough(false)
  //     }
  //     return setIsMotorEnough(true)
  //   }
  // }, [currentPark, transOption])

  useEffect(() => {
    if (!warningMsg) return
    contentRef.current = warningMsg
    setIsActive(true)
  }, [warningMsg])

  // const warningClass = () => {
  //   if (!warning) return 'warning'
  //   if (!isCarEnough || !isMotorEnough) return 'warning active'
  //   if (isEmptyId) return 'warning active'
  //   return 'warning'
  // }

  return (
    <div className={`warning ${isActive? 'active': ''}`}>
      <div className="warning__content">
        <img src={warning} alt="warning" />
        <p>{contentRef.current}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          //關掉視窗
          setIsActive(false)
          dispatch(setWarningMsg(''))

          // setIsMotorEnough(true)
          // // setIsCarEnough(true)
          // dispatch(setIsEmptyId(false))
          // const queryStr = location.search
          // navigate(`.${queryStr}`, {push: true})  //這邊網址要注意
          // dispatch(setCurrentPark(null))
        }}
        className="warning__btn">確認</button>
    </div>
  )
  

}