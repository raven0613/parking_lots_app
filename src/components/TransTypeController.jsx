import { useEffect, useState } from 'react'
import car from '../assets/images/car-.svg'
import motor from '../assets/images/motorbike.svg'

export default function TransTypeController (props) {
  const { transOption, setTransOption } = props
  const [isCar, setIsCar] = useState(true)
  let carClass = `control-type__btn control-type__car ${isCar? 'active' : ''}`
  let motorClass = `control-type__btn control-type__motor ${isCar? '' : 'active'}`
  

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
          setTransOption('motor')
          localStorage.setItem('transOption', 'motor')
        }
        if(transOption === 'motor') { 
          setTransOption('car') 
          localStorage.setItem('transOption', 'car')
        }
      }}
    >
      <button
        className={carClass} ><img src={car} alt="car" />
      </button>

      <button
        className={motorClass} ><img src={motor} alt="motor" />
      </button>
    </div>
  )
}