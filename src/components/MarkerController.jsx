import { useEffect, useState } from 'react'
import car from '../assets/images/car-.svg'
import motor from '../assets/images/motorbike.svg'

export default function MarkerController (props) {
  const { markerOption, setMarkerOption } = props
  const [isPay, setIsPay] = useState(true)

  let payClass = `control-type__btn control-type__car ${markerOption === 'pay' ? '' : 'active'}`
  let countsClass = `control-type__btn control-type__motor ${markerOption === 'counts' ? 'active' : ''}`
  

  useEffect(() => {
    console.log(markerOption)
  }, [markerOption])

  return (
    <div className='control-type control-type__marker'>
      
      <button
        className={payClass}
        onClick={() => {
          setMarkerOption('pay')
          console.log(markerOption)
        }}><p>價格</p>
      </button>

      <button
        className={countsClass}
        onClick={() => {
          setMarkerOption('counts')
          console.log(markerOption)
        }}><p>車位</p>
      </button>
    </div>
  )
}