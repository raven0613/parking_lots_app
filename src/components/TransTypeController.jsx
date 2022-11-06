import { useEffect, useState } from 'react'
import car from '../assets/images/car-.svg'
import motor from '../assets/images/motorbike.svg'

export default function TransTypeController (props) {
  const { transOption, setTransOption } = props
  const [isCar, setIsCar] = useState(true)
  let carClass = `trans-type__btn trans-type__car ${isCar? 'active' : ''}`
  let motorClass = `trans-type__btn trans-type__motor ${isCar? '' : 'active'}`
  

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
    <div className='trans-type'>
      
      <button
        className={carClass}
        onClick={() => {
          setTransOption('car')
          localStorage.setItem('transOption', 'car')
        }}><img src={car} alt="car" />
      </button>

      <button
        className={motorClass}
        onClick={() => {
          setTransOption('motor')
          localStorage.setItem('transOption', 'motor')
        }}><img src={motor} alt="motor" />
      </button>
    </div>
  )
}