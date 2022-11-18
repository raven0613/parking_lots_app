import disabled from '../../assets/images/disabled.svg'
import charging from '../../assets/images/charging.svg'
import pregnancy from '../../assets/images/pregnancy.svg'
import filterClear from '../../assets/images/filter-clear.svg'
import filter from '../../assets/images/filter.svg'
import filterAll from '../../assets/images/filter-all.svg'

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
        <img src={filter} alt="filter" />
      </button>


      <div className={isPanelActive? 'filter__panel active' : 'filter__panel'}>
        <button 
          onClick={() => {
            //是否顯示車位為0的停車場
            dispatch(setIsShowZero(!isShowZero))
          }} 
        className={`filter__btn zero ${isShowZero? 'active' : ''}`}>
          <img className="filter__img" src={filterAll} alt="filterZero" />
        </button>



        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('clear')
          }} 
        className='filter__btn clear'>
          <img className="filter__img" src={filterClear} alt="filterClear" />
        </button>


        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('disabled')
          }} 
        className={`filter__btn disabled ${isDisabledActive? 'active' : ''}`}>
          <img className="filter__img" src={disabled} alt="disabled" />
        </button>


        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('pregnancy')
          }} 
        className={`filter__btn pregnancy ${isPregnancyActive? 'active' : ''}`}>
          <img className="filter__img" src={pregnancy} alt="pregnancy" />
        </button>


        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFilterToggle('charging')
          }} 
         className={`filter__btn charging ${isChargingActive? 'active' : ''}`}>

        <img className="filter__img" src={charging} alt="charging" />

        </button>
      </div>
    </>

  )
}