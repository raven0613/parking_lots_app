import { useEffect, useState, useContext } from 'react'
import price from '../assets/images/price.svg'
import parks from '../assets/images/parks.svg'

// import { allContext } from '../pages/Home'
import { allContext } from '../utils/Provider'

import { useSelector, useDispatch } from 'react-redux'
import { setMarkerOption } from '../reducer/reducer'

export default function MarkerController () {
  const markerOption = useSelector((state) => state.park.markerOption)
  const dispatch = useDispatch()

  let disabled = markerOption? '' : 'disabled'
  let payClass = `${disabled} control-type__btn control-type__up
  ${markerOption === 'pay' ? '' : 'active'}`

  let countsClass = `${disabled} control-type__btn control-type__down
  ${markerOption === 'counts' ? 'active' : ''}`


  return (
    <div className='control-type control-type__marker'
      onClick={() => {
        if(markerOption === 'pay') return dispatch(setMarkerOption('counts'))
        if(markerOption === 'counts') return dispatch(setMarkerOption('pay'))
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