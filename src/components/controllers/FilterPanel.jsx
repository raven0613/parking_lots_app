import { ReactComponent as Disabled } from '../../assets/images/disabled.svg'
import { ReactComponent as Charging } from '../../assets/images/charging.svg'
import { ReactComponent as Pregnancy } from '../../assets/images/pregnancy.svg'
import { ReactComponent as FilterClear } from '../../assets/images/filter-clear.svg'
import { ReactComponent as Filter } from '../../assets/images/filter.svg'
import { ReactComponent as FilterAll } from '../../assets/images/filter-all.svg'

import { useSelector, useDispatch } from 'react-redux'
import { setIsShowZero } from '../../reducer/reducer'

export default function FilterPanel ({onFilterToggle, onPanelToggle, isDisabledActive, isPregnancyActive, isChargingActive, isPanelActive}) {

  const isShowZero = useSelector((state) => state.park.isShowZero)
  const dispatch = useDispatch()

  return (
    <>
      {/* filterPanel button */}
      <button 
      onClick={(e) => { 
        e.preventDefault()
        e.stopPropagation()
        onPanelToggle()
      }} className='filter__toggle'>
        <Filter className='icon' alt="filter" />
      </button>


      <div className={isPanelActive? 'filter__panel active' : 'filter__panel'}>
        <button 
          onClick={() => {
            //是否顯示車位為0的停車場
            dispatch(setIsShowZero(!isShowZero))
          }} 
        className={`filter__btn zero ${isShowZero? 'active' : ''}`}>
          <FilterAll className="filter__img" alt="filterZero" />
        </button>



        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('clear')
          }} 
        className='filter__btn clear'>
          <FilterClear className="filter__img" alt="filterClear" />
        </button>


        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('disabled')
          }} 
        className={`filter__btn disabled ${isDisabledActive? 'active' : ''}`}>
          <Disabled className="filter__img" alt="disabled" />
        </button>


        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('pregnancy')
          }} 
        className={`filter__btn pregnancy ${isPregnancyActive? 'active' : ''}`}>
          <Pregnancy className="filter__img" alt="pregnancy" />
        </button>


        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('charging')
          }} 
         className={`filter__btn charging ${isChargingActive? 'active' : ''}`}>

        <Charging className="filter__img" alt="charging" />

        </button>
      </div>
    </>

  )
}