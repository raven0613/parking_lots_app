import disabled from '../assets/images/disabled.svg'
import charging from '../assets/images/charging.svg'
import pregnancy from '../assets/images/pregnancy.svg'
import filterClear from '../assets/images/filter-clear.svg'
import filter from '../assets/images/filter.svg'
import filterAll from '../assets/images/filter-all.svg'
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from 'react-redux'
import { setFilterConditions, setIsShowZero } from '../reducer/reducer'

export default function FilterPanel () {
  const filterConditions = useSelector((state) => state.park.filterConditions)
  const isShowZero = useSelector((state) => state.park.isShowZero)
  const dispatch = useDispatch()

  const [isActive, setIsActive] = useState(false)
  const [isDisabledActive, setIsDisabledActive] = useState(false)
  const [isPregnancyActive, setIsPregnancyActive] = useState(false)
  const [isChargingActive, setIsChargingActive] = useState(false)

  useEffect(() => {
    dispatch(setFilterConditions(['all']))
  },[])

  const panelClassName = () => {
    if (isActive) {
      return 'filter__panel active'
    } 
    return 'filter__panel'
  }

  return (
    <>
      <button 
      onClick={() => { 
        setIsActive(!isActive)
      }} className='filter__toggle'>
        <img src={filter} alt="filter" />
      </button>

      <div className={panelClassName()}>
        <button 
          onClick={() => {
            //是否顯示車位為0的停車場
            dispatch(setIsShowZero(!isShowZero))
          }} 
        className={`filter__btn zero ${isShowZero? 'active' : ''}`}>
          <img className="filter__img" src={filterAll} alt="filterZero" />
        </button>

        <button 
          onClick={() => {
            dispatch(setFilterConditions(['all']))
            setIsDisabledActive(false)
            setIsPregnancyActive(false)
            setIsChargingActive(false)
          }} 
        className='filter__btn clear'>
          <img className="filter__img" src={filterClear} alt="filterClear" />
        </button>


        <button 
          onClick={() => {
             setIsDisabledActive(!isDisabledActive)
            //如果是空的就加進去
            if (!filterConditions) return dispatch(setFilterConditions(['disabled']))

            //如果有找到就刪掉
            if (filterConditions.find(con => con === 'disabled')) {
              const conditions = filterConditions.filter(con => con !== 'disabled')
              return dispatch(setFilterConditions(conditions))
            }
            //沒找到就加進去
            return dispatch(setFilterConditions([...filterConditions, 'disabled']))
          }} 
        className={`filter__btn disabled ${isDisabledActive? 'active' : ''}`}>
          <img className="filter__img" src={disabled} alt="disabled" />
        </button>


        <button
          onClick={() => {
            setIsPregnancyActive(!isPregnancyActive)
            if (!filterConditions) return dispatch(setFilterConditions(['pregnancy']))
            
            if (filterConditions.find(con => con === 'pregnancy')) {
              const conditions = filterConditions.filter(con => con !== 'pregnancy')
              return dispatch(setFilterConditions(conditions))
            }
            return dispatch(setFilterConditions([...filterConditions, 'pregnancy']))
          }} 
        className={`filter__btn pregnancy ${isPregnancyActive? 'active' : ''}`}>
          <img className="filter__img" src={pregnancy} alt="pregnancy" />
        </button>


        <button
          onClick={() => {
            setIsChargingActive(!isChargingActive)
            if (!filterConditions) return dispatch(setFilterConditions(['charging']))

            if (filterConditions.find(con => con === 'charging')) {
              const conditions = filterConditions.filter(con => con !== 'charging')
              return dispatch(setFilterConditions(conditions))
            }
            return dispatch(setFilterConditions([...filterConditions, 'charging']))
          }} 
         className={`filter__btn charging ${isChargingActive? 'active' : ''}`}>

        <img className="filter__img" src={charging} alt="charging" />

        </button>
      </div>
    </>

  )
}