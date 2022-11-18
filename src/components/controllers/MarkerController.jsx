import { ReactComponent as Parks } from '../../assets/images/parks.svg'
import { ReactComponent as Price } from '../../assets/images/price.svg'

import { useSelector, useDispatch } from 'react-redux'
import { setMarkerOption } from '../../reducer/reducer'

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
        <Price className='icon' alt='price' />
      </button>

      <button className={countsClass} >
        <Parks className='icon' alt='parks' />
      </button>
    </div>
  )
}