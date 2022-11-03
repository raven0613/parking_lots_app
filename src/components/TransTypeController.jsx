import car from '../assets/images/car-.svg'
import motor from '../assets/images/motorbike.svg'

export default function ModeController (props) {
  const { transOption, setTransOption } = props
  let carClass = ''
  let motorClass = ''
  if (transOption === 'car')  {
    carClass = 'trans-type__btn trans-type__car active'
    motorClass = 'trans-type__btn trans-type__motor'
  }
  else if (transOption === 'motor') {
    carClass = 'trans-type__btn trans-type__car'
    motorClass = 'trans-type__btn trans-type__motor active'
  }


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