import parkMarker from '../assets/images/marker-parking.svg'
import parkMarkerSmall from '../assets/images/marker-parking-small.svg'
import parkMarkerZero from '../assets/images/marker-parking-zero.svg'

import { getPointsInDistance, parksTransFilter, parksWithRemainings, userFilterParks, availableCounts, payment, parksWithWeather } from '../utils/parkHelpers'
import ParkingMark from './ParkingMark'
import { useState, useEffect, useContext, useRef } from 'react'
import { mapContext } from '../store/UIDataProvider'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPark, setNearParks, setWarningMsg } from '../reducer/reducer'


export default function ParkMarkerController ({ allParks, weather, remainings }) {
  const mode = useSelector((state) => state.map.mode)
  const selfPos = useSelector((state) => state.map.selfPos)
  const transOption = useSelector((state) => state.park.transOption)
  const markerOption = useSelector((state) => state.park.markerOption)
  const currentPark = useSelector((state) => state.park.currentPark)
  const nearParks = useSelector((state) => state.park.nearParks)
  const filterConditions = useSelector((state) => state.park.filterConditions)
  const mapCenter = useSelector((state) => state.map.mapCenter)
  const target = useSelector((state) => state.map.target)
  const isShowZero = useSelector((state) => state.park.isShowZero)
  const warningMsg = useSelector((state) => state.park.warningMsg)
  const dispatch = useDispatch()
  
  const { directions,  setDirections } = useContext(mapContext)

  //路由相關
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  //parkId存在的話(已經在追蹤某停車場)就放入網址
  const parkId = params.parkId
  const [userFilteredParks, setUserFilteredParks] = useState([])
  const currentRemainingsRef = useRef()


  //有所有停車場資料(initParkingLots)後 & 網址改變時
  useEffect(() => {
    if (!allParks) return
    if (!parkId) {
      setDirections(null)
      dispatch(setCurrentPark(null))
      return
    }

    //網址上的park id 沒找到就彈提醒窗
    const paramsPark = allParks.find(park => park.id === parkId)

    if (!paramsPark) {
      dispatch(setWarningMsg('查無此停車場'))
      return
    }
    //加入最新的剩餘車位資料 & 天氣資料
    let parkData = parksWithRemainings([paramsPark], remainings)[0]
    parkData = parksWithWeather([parkData], weather)[0]
    //確保拿到最新的資料
    dispatch(setCurrentPark(parkData))
  }, [ allParks, dispatch, parkId, remainings, setDirections, weather ])

  

  //剩餘車位資料成功抓進來後重新丟進 currentPark
  useEffect(() => {
    if (currentPark?.id) {
      const currentParksWithRemainings = parksWithRemainings([currentPark], remainings)[0]
      dispatch(setCurrentPark(currentParksWithRemainings))
    }
  }, [remainings, dispatch])

  //天氣資料成功抓進來後重新丟進 currentPark
  useEffect(() => {
    if (currentPark?.id) {
      const currentParksWithWeather = parksWithWeather([currentPark], weather)[0]
      dispatch(setCurrentPark(currentParksWithWeather))
    }
  }, [weather, dispatch])
  


  // selfPos 傳進來時先 fetch 停車場資料，並且用距離先篩過
  useEffect(() => {
    if (mode !== 'self') return
    const basedParks = userFilteredParks?.length? userFilteredParks : allParks
    const filteredParks = filteredNearParks(basedParks, remainings, weather, selfPos, transOption, isShowZero)

    dispatch(setNearParks(filteredParks))
  }, [selfPos, mode, transOption, remainings, userFilteredParks, isShowZero, weather, allParks, dispatch])

  // target的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'target') return
    const basedParks = userFilteredParks?.length? userFilteredParks : allParks
    const filteredParks = filteredNearParks(basedParks, remainings, weather, target, transOption, isShowZero)

    dispatch(setNearParks(filteredParks))
  }, [target, mode, transOption, remainings, userFilteredParks, isShowZero, weather, allParks, dispatch])

  // mapCenter的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'screen-center') return
    //決定以誰為基準，userFilterParks為空的話就以 allParks來算
    const basedParks = userFilteredParks?.length? userFilteredParks : allParks
    const filteredParks = filteredNearParks(basedParks, remainings, weather, mapCenter, transOption, isShowZero)

    dispatch(setNearParks(filteredParks))
  }, [mapCenter, mode, transOption, remainings, userFilteredParks, isShowZero, weather, allParks, dispatch])


  // filter 條件切換
  useEffect(() => {
    //條件是all的話，userFilterParks　會直接為空
    let filteredParkingLots = userFilterParks(filterConditions, allParks)
    setUserFilteredParks(filteredParkingLots)
  }, [filterConditions, allParks])


  //提示訊息設定   每次更新時前後id沒變 & 車位不足 才跳提醒
  useEffect(() => {
    if (!currentPark?.id) return
      if (availableCounts(transOption, currentPark) < 1) {
        if (transOption === 'car') {
          dispatch(setWarningMsg('您的目標停車場無汽車停車格'))
        }
        else if (transOption === 'motor') {
          dispatch(setWarningMsg('您的目標停車場無機車停車格'))
        }
      }
  }, [transOption, dispatch, currentPark])
  
  // 依據情況設定 WarningMsg
  useEffect(() => {
    if (!currentPark?.id) return
    
    // 如果是一開始就>0的，再進行車位數量追蹤（為了避免點開0的也跳視窗）
    if (currentRemainingsRef.current?.id === currentPark.id && availableCounts(transOption, currentRemainingsRef.current) > 0) {
      if (availableCounts(transOption, currentPark) < 1) {
        dispatch(setWarningMsg('您的目標停車場無剩餘車位'))
      }
    }
    if (warningMsg) {
      if (availableCounts(transOption, currentPark) > 0) {
        dispatch(setWarningMsg(''))
      }
    }
    currentRemainingsRef.current = {
      id: currentPark.id, 
      availablecar: currentPark.availablecar, 
      availablemotor: currentPark.availablemotor }
  }, [currentPark, dispatch, transOption, warningMsg])


  //排除掉點擊中的
  const nearParksWithOutCurrent = nearParks?.filter(park => {
    if (!currentPark?.id) return park
    return park.id !== currentPark.id
  })
  //子元件parkMarker被點擊後
  function handleMarkerToggled (park) {
    const queryStr = location.search
    dispatch(setCurrentPark(park))
    navigate(`/map/${park.id}${queryStr}`, {push: true})
  }

  //因為 state 的值更新後此 component 會重新 render，所以先判斷 state 到底存不存在
  return (
    <>
      <ParkingMark 
        nearParksWithOutCurrent={nearParksWithOutCurrent} 
        label={label} icon={icon} 
        availableCounts={availableCounts} 
        directions={directions}
        currentPark={currentPark}
        transOption={transOption}
        markerOption={markerOption}
        onMarkerToggled={handleMarkerToggled}
      />
    </>
  )
}

//每次更新身邊停車場時要跑的篩選
function filteredNearParks (basedParks, remainings, weather, center, transOption, isShowZero) {
    //算出與自身位置一定距離內的點
    let filteredParkingLots = getPointsInDistance(basedParks, center, 0.01)
    //將停車場資料與 remainings 資料合併
    filteredParkingLots = parksWithRemainings(filteredParkingLots, remainings)
    filteredParkingLots = parksWithWeather(filteredParkingLots, weather)
    //將帶有最新 remainings 資料的停車場以機車or汽車篩選
    filteredParkingLots = parksTransFilter(filteredParkingLots, transOption)
    //篩選只顯示>0的
    const availablePark = filteredParkingLots.filter(park => availableCounts(transOption, park) > 0 )
    if (!isShowZero) return availablePark
    return filteredParkingLots
}


function label (markerOption, transOption, place, isCurr) {
  if (availableCounts(transOption, place) === '0') {
    return {
      text: markerOption === 'pay' ? payment(transOption, place) : availableCounts(transOption, place),
      className: isCurr? markerOption === 'pay' ? 'marker__current--zero marker__current--zero--pay' : 'marker__current--zero' : 'marker',
      color: '#dbe1e6',
      fontSize: isCurr? '18px' : '10px'
    }
  }
  //車位不夠
  if (availableCounts(transOption, place) < 10) {
    return {
      text: markerOption === 'pay' ? payment(transOption, place) : availableCounts(transOption, place),
      className: isCurr? markerOption === 'pay' ? 'marker__current--sm marker__current--sm--pay' : 'marker__current--sm' : 'marker',
      color: 'white',
      fontSize: isCurr? '20px' : '12px'
    }
  }
  //車位夠
  return {
    text: markerOption === 'pay' ? payment(transOption, place) : availableCounts(transOption, place),
    className: isCurr? markerOption === 'pay' ? 'marker__current marker__current--pay' : 'marker__current' : 'marker',
    color: 'white',
    fontSize: isCurr? '22px' : '14px'
  }
}

//icon 的設定
function icon (transOption, place, isCurr) {
  if (availableCounts(transOption, place) === '0') {
    return {
      url: isCurr ? '' : parkMarkerZero,
      scaledSize: isCurr? { width: 48, height: 48 } : { width: 38, height: 38 }
    }
  }
  if (availableCounts(transOption, place) < 10) {
    return {
      url: isCurr ? '' : parkMarkerSmall,
      scaledSize: isCurr? { width: 60, height: 60 } : { width: 44, height: 44 }
    }
  }
  return {
    url: isCurr ? '' : parkMarker,
    scaledSize: isCurr? { width: 72, height: 72 } : { width: 52, height: 52 },
  }
}