import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setFilterConditions } from '../../reducer/reducer'
import FilterPanel from './FilterPanel'


export default function FilterPanelController () {
  const filterConditions = useSelector((state) => state.park.filterConditions)
  const dispatch = useDispatch()

  const [isPanelActive, setIsPanelActive] = useState(false)



  useEffect(() => {
    dispatch(setFilterConditions(['all']))
  },[])


  function atFilterToggle (filterType) {
    if (filterType === 'clear') {
      dispatch(setFilterConditions(['all']))
      return
    }
    //先把all刪除，剩下原本有的
    let conditions = filterConditions.filter(con => con !== 'all')

    //如果點選的filter已經有了就刪掉
    if (filterConditions.find(con => con === filterType)) {
      conditions = filterConditions.filter(con => con !== filterType)
      return dispatch(setFilterConditions(conditions))
    }
    //點選的filter還沒有就加進去
    return dispatch(setFilterConditions([...conditions, filterType]))
  }

  function atPanelToggle () {
    setIsPanelActive(!isPanelActive)
  }

  const isDisabledActive = filterConditions.some(con => con === 'disabled')
  const isPregnancyActive = filterConditions.some(con => con === 'pregnancy')
  const isChargingActive = filterConditions.some(con => con === 'charging')
  

  return (
    <FilterPanel 
      onFilterToggle={atFilterToggle} 
      onPanelToggle={atPanelToggle}
      isDisabledActive={isDisabledActive} 
      isPregnancyActive={isPregnancyActive} 
      isChargingActive={isChargingActive}
      isPanelActive={isPanelActive}
    />
  )
}