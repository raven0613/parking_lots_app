import { ReactComponent as Car } from '../../assets/images/car.svg'
import { ReactComponent as Motor } from '../../assets/images/motorbike.svg'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTransOption } from '../../reducer/reducer'

export default function TransTypeController () {
  const transOption = useSelector((state) => state.park.transOption)
  const dispatch = useDispatch()
  
  const [isCar, setIsCar] = useState(true)

  let disabled = transOption? '' : 'disabled'
  let carClass = `${disabled} control-type__btn control-type__up 
  ${isCar? 'active' : ''}`

  let motorClass = `${disabled} control-type__btn control-type__down 
  ${isCar? '' : 'active'}`
  
  //一載入就去抓使用者的上次交通工具設定
  useEffect(() => {
    if (!localStorage.getItem('transOption')) return
    dispatch(setTransOption(localStorage.getItem('transOption')))
  }, [])
  
  useEffect(() => {
    if (!transOption) return
    if (transOption === 'car')  {
      setIsCar(true)
    }
    else if (transOption === 'motor') {
      setIsCar(false)
    }
  }, [transOption])

  return (
    <div className='control-type control-type__trans'
      onClick={() => {
        if(transOption === 'car') {
          dispatch(setTransOption('motor'))
          localStorage.setItem('transOption', 'motor')
        }
        if(transOption === 'motor') { 
          dispatch(setTransOption('car') )
          localStorage.setItem('transOption', 'car')
        }
      }}
    >
      <button className={carClass} >
        <Car className='icon' alt="car" />
      </button>

      <button className={motorClass} >
        <Motor className='icon' alt="motor" />
      </button>
    </div>
  )
}