import car from '../assets/images/car-.svg'
import motor from '../assets/images/motorbike.svg'

export default function ModeController (props) {
  const { setTransOption } = props

  return (
    <div className='trans-type'>
      
      <button
        className='trans-type__btn trans-type__car'
        onClick={() => {
          setTransOption('car')
          localStorage.setItem('transOption', 'car')
        }}><img src={car} alt="car" />
      </button>

      <button
        className='trans-type__btn trans-type__motor'
        onClick={() => {
          setTransOption('motor')
          localStorage.setItem('transOption', 'motor')
        }}><img src={motor} alt="motor" />
      </button>
    </div>
  )
}