import { useEffect, useState } from 'react'
import price from '../assets/images/price.svg'
import parks from '../assets/images/parks.svg'

export default function MarkerController (props) {
  const { markerOption, setMarkerOption } = props

  let disabled = markerOption? '' : 'disabled'
  let payClass = `${disabled} control-type__btn control-type__up
  ${markerOption === 'pay' ? '' : 'active'}`

  let countsClass = `${disabled} control-type__btn control-type__down
  ${markerOption === 'counts' ? 'active' : ''}`


  return (
    <div className='control-type control-type__marker'
      onClick={() => {
        if(markerOption === 'pay') return setMarkerOption('counts')
        if(markerOption === 'counts') return setMarkerOption('pay')
      }}
    >
      <button className={payClass} >
        <img src={price} alt='price'>
        </img>
      </button>

      <button className={countsClass} >
        <img src={parks} alt='parks'>
        </img>
      </button>
    </div>
  )
}