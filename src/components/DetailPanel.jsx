import availableCar from '../assets/images/detail-car.svg'
import availableMotor from '../assets/images/detail-motor.svg'
import disabled from '../assets/images/disabled.svg'
import address from '../assets/images/address.svg'
import payex from '../assets/images/payex.svg'
import serviceTime from '../assets/images/service-time.svg'
import tel from '../assets/images/tel.svg'
import back from '../assets/images/back.svg'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'


export default function DetailPanel (props) {
  const { currentPark, setCurrentPark } = props
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [device, setDevice] = useState('PC')

  let className = ''
  if (currentPark) {
    className = 'detail__panel active'
  } else {
    className = 'detail__panel'
  }
  const viewWidth = document.body.clientWidth

  const handleRWD = () => {
      if (window.innerWidth > 990)
          setDevice("PC");
      else if (window.innerWidth > 600)
          setDevice("tablet");
      else if (window.innerWidth > 420)
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

  if (!currentPark) return <></>
  let points = ''
  if (currentPark.name.length > 10) {
    points = ' ...'
  }
  const subTitle = `${currentPark.name.slice(0, 10)}${points}`
  const isDisabled = currentPark.summary.includes('身心') || currentPark.Handicap_First > 0

  if (currentPark) {
    return (
        <div className={className}>
          <div className="detail__title">
            <img 
              className="detail__title--back" 
              src={back} alt="back" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentPark(null)
                if (queryParams.has('target')) {
                  return navigate(`/map?target=${queryParams.get('target')}`)
                }
                return navigate(`/map`)
              }}/>
            <h2 className="detail__title--title">{device === 'mobile' ? subTitle : currentPark.name}</h2>
            {isDisabled && <img className="detail__title--img" src={disabled} alt="disabled-parking" />}
          </div>

          <div className="detail__content">
            <img className="detail__content--img" src={address} alt="address" />
            <p className="detail__content--content">{currentPark.address}</p>
          </div>

          <div className="detail__content">
            <img className="detail__content--img" src={tel} alt="tel" />
            <p className="detail__content--content">{currentPark.tel}</p>
          </div>

          <div className="detail__content">
            <img className="detail__content--img" src={serviceTime} alt="serviceTime" />
            <p className="detail__content--content">{currentPark.serviceTime}</p>
          </div>

          <div className="detail__content">
            <img className="detail__content--img" src={payex} alt="payex" />
            <p className="detail__content--content">{currentPark.payex}</p>
          </div>


          <div className="detail__bottom">

            <p className="detail__bottom--distance">預計 5 分鐘內可抵達</p>

            <div className="detail__bottom--available">
              <img className="detail__bottom--img" src={availableCar} alt="availableCar" />
              <p className="detail__bottom--counts number">{currentPark.availablecar}</p>

              <img className="detail__bottom--img" src={availableMotor} alt="availableMotor" />
              <p className="detail__bottom--counts number">{currentPark.availablemotor}</p>
            </div>
          </div>

        </div>
    )
  }

}