import disabled from '../assets/images/disabled.svg'
import charging from '../assets/images/charging.svg'
import pregnancy from '../assets/images/pregnancy.svg'
import filterClear from '../assets/images/filter-clear.svg'
import filter from '../assets/images/filter.svg'
import { useState, useContext, useEffect } from "react";
// import { allContext } from '../pages/Home'
import { allContext } from '../utils/Provider'


export default function FilterPanel () {
  const { setFilterConditions, filterConditions } = useContext(allContext)

  const [isActive, setIsActive] = useState(false)
  const [isDisabledActive, setIsDisabledActive] = useState(false)
  const [isPregnancyActive, setIsPregnancyActive] = useState(false)
  const [isChargingActive, setIsChargingActive] = useState(false)

  useEffect(() => {
    setFilterConditions(['all'])
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
            setFilterConditions(['all'])
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
            if (!filterConditions) return setFilterConditions(['disabled'])

            //如果有找到就刪掉
            if (filterConditions.find(con => con === 'disabled')) {
              const conditions = filterConditions.filter(con => con !== 'disabled')
              return setFilterConditions(conditions)
            }
            //沒找到就加進去
            return setFilterConditions([...filterConditions, 'disabled'])
          }} 
        className={`filter__btn disabled ${isDisabledActive? 'active' : ''}`}>
          <img className="filter__img" src={disabled} alt="disabled" />
        </button>


        <button
          onClick={() => {
            setIsPregnancyActive(!isPregnancyActive)
            if (!filterConditions) return setFilterConditions(['pregnancy'])
            
            if (filterConditions.find(con => con === 'pregnancy')) {
              const conditions = filterConditions.filter(con => con !== 'pregnancy')
              return setFilterConditions(conditions)
            }
            return setFilterConditions([...filterConditions, 'pregnancy'])
          }} 
        className={`filter__btn pregnancy ${isPregnancyActive? 'active' : ''}`}>
          <img className="filter__img" src={pregnancy} alt="pregnancy" />
        </button>


        <button
          onClick={() => {
            setIsChargingActive(!isChargingActive)
            if (!filterConditions) return setFilterConditions(['charging'])
            if (filterConditions.find(con => con === 'charging')) {
              const conditions = filterConditions.filter(con => con !== 'charging')
              return setFilterConditions(conditions)
            }
            return setFilterConditions([...filterConditions, 'charging'])
          }} 
         className={`filter__btn charging ${isChargingActive? 'active' : ''}`}>

        <img className="filter__img" src={charging} alt="charging" />

        </button>
      </div>
    </>

  )
}