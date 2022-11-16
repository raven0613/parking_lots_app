import warning from '../assets/images/warning.svg'
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setWarningMsg } from '../reducer/reducer'


export default function Warning () {
  const warningMsg = useSelector((state) => state.UI.warningMsg)
  const dispatch = useDispatch()

  const [isActive, setIsActive] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()

  //提醒內容（為了讓往關閉跑動畫時也有字）
  const contentRef = useRef(warningMsg)


  useEffect(() => {
    if (!warningMsg) return
    contentRef.current = warningMsg
    setIsActive(true)
  }, [warningMsg])



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
          if (warningMsg === '查無此停車場') {
            const queryStr = location.search
            navigate(`.${queryStr}`, {push: true})
          }
        }}
        className="warning__btn">確認</button>
    </div>
  )
  

}