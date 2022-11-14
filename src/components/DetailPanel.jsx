import availableCar from '../assets/images/detail-car.svg'
import navigateIcon from '../assets/images/navigate.svg'
import pregnancy from '../assets/images/pregnancy.svg'
import charging from '../assets/images/charging.svg'
import availableMotor from '../assets/images/detail-motor.svg'
import disabled from '../assets/images/disabled.svg'
import address from '../assets/images/address.svg'
import payex from '../assets/images/payex.svg'
import serviceTime from '../assets/images/service-time.svg'
import tel from '../assets/images/tel.svg'
import back from '../assets/images/back.svg'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
// import { allContext } from '../pages/Home'
import { allContext } from '../utils/Provider'
import { useRef } from 'react'


import { useSelector, useDispatch } from 'react-redux'
// import { setCurrentPark } from '../utils/Provider'
import { setCurrentPark, setCanFetchDirection } from '../reducer/reducer'


export default function DetailPanel () {
  const currentPark = useSelector((state) => state.park.currentPark)
  const dispatch = useDispatch()
  
  const { directions, setDirections } = useContext(allContext)
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [device, setDevice] = useState('PC')
  const currentRef = useRef(currentPark)
  const [isDetailActive, setIsDetailActive] = useState(false)



  const handleRWD = () => {
      if (window.innerWidth > 990)
          setDevice("PC");
      else if (window.innerWidth > 600)
          setDevice("tablet");
      else if (window.innerWidth > 500)
          setDevice("mobileL");
      else
          setDevice("mobile");
  }

  useEffect(()=>{ 
      window.addEventListener('resize',handleRWD)
      handleRWD()
      return(()=>{
          window.removeEventListener('resize',handleRWD)
      })
  },[]);

  //currentRef用來記錄原值以免造成空版
  useEffect(()=>{ 
    if (!currentPark?.id) return
    currentRef.current = currentPark
  },[currentPark]);

  //看有沒有 currentPark 來決定要顯示哪個
  const currentDisplay = currentPark?.id? currentPark : currentRef.current
  const containerClass = isDetailActive ? 'detail__container active' : 'detail__container'

  if (!currentDisplay?.id) return <></>
  const isDisabled = currentDisplay.summary.includes('身心') || currentDisplay.Handicap_First > 0
  const isPregnancy = currentDisplay.Pregnancy_First > 0
  
  if (currentDisplay) {
    return (
        <div className="detail__panel">
          <div className="detail__title">
            <img 
              className="detail__title--back" 
              src={back} alt="back" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // setCurrentPark(null)
                dispatch(setCurrentPark(null))

                if (queryParams.has('target')) {
                  return navigate(`/map?target=${queryParams.get('target')}`)
                }
                return navigate(`/map`)
              }}/>
            <h3 className="detail__title--title">{currentDisplay.name}</h3>

            {/* 路線按紐 */}
            {!directions && <button onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dispatch(setCanFetchDirection(true))
            }} className="detail__title--navi">
              <img src={navigateIcon} alt='navigate'></img>
              <p>路線</p>
            </button>}
            
            {directions && <button onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDirections(null)
            }} className="detail__title--navi">
              <img src={navigateIcon} alt='navigate'></img>
              <p>關閉</p>
            </button>}

          </div>


          <div className="detail__info">
            {/* 剩餘車位 */}
            <div className="detail__info--available">
              <img className="detail__info--img" src={availableCar} alt="availableCar" />
              <p className="detail__info--counts number">{currentDisplay.availablecar}</p>

              <img className="detail__info--img" src={availableMotor} alt="availableMotor" />
              <p className="detail__info--counts number">{currentDisplay.availablemotor}</p>

              {currentDisplay.ChargingStation > 0 && <img className="detail__info--img" src={charging} alt="charging" />}
            </div>

            {/* 預計到達時間 */}
            {directions && <p className="detail__info--time">預計 {directions.routes[0].legs[0].duration.text}</p>}

          </div>



          <div className={containerClass}>
            <div className="detail__content">
              {/* 價格顯示方式 */}
              {device !== 'PC' && device !== 'tablet' && isDetailActive && payexContent (currentDisplay)}
              {device !== 'PC' && device !== 'tablet' && !isDetailActive && payContent (currentDisplay)}
              
              {device === 'PC' && payexContent (currentDisplay)}
              {device === 'tablet' && payexContent (currentDisplay)}
            </div>
            
            <div className="detail__content">
              <img className="detail__content--img" src={serviceTime} alt="serviceTime" />
              <p className="detail__content--content">{currentDisplay.serviceTime}</p>
            </div>

            <div className="detail__content">
              <img className="detail__content--img" src={address} alt="address" />
              <p className="detail__content--content">{currentDisplay.address}</p>
            </div>

            <div className="detail__content">
              <img className="detail__content--img" src={tel} alt="tel" />
              <p className="detail__content--content">{currentDisplay.tel}</p>
            </div>

            <div className="detail__container--img">
              {isPregnancy && <img className="detail__container--img-pregnancy" src={pregnancy} alt="pregnancy-parking" />}

              {isDisabled && <img className="detail__container--img-disabled" src={disabled} alt="disabled-parking" />}
            </div>


            <button className='detail__container--button' 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDetailActive(!isDetailActive)
              }}>
              {isDetailActive? '收起' : '查看詳細'}
            </button>
          </div>

        </div>
    )
  }

}

function payContent (currentDisplay) {
  return (
    <>
      <img className="detail__content--img" src={payex} alt="payex" />
      <p className="detail__content--content">{currentDisplay.pay}元</p>
    </>
  )
}
function payexContent (currentDisplay) {
  return (
    <>
      <img className="detail__content--img" src={payex} alt="payex" />
      <p className="detail__content--content">{currentDisplay.payex}</p>
    </>
  )
}