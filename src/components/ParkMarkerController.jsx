import parkMarker from '../assets/images/marker-parking.svg'
import parkMarkerSmall from '../assets/images/marker-parking-small.svg'
import parkMarkerZero from '../assets/images/marker-parking-zero.svg'
import { getParkingLots, getRemaining } from '../apis/places'

import { coordinatesConvert, getStraightDistance, parksTransFilter, parksWithRemainings, getNearParksTime, payexFilter, formattedParksData, userFilterParks } from '../utils/parkHelpers'
import ParkingMark from './ParkingMark'
import { useState, useEffect, useContext, useRef } from 'react'
import { parkContext, mapContext } from '../store/UIDataProvider'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ReactComponent as ParkMarker } from '../assets/images/marker-parking.svg'

import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPark, setNearParks, setRemainings, setIsEmptyId, setWarningMsg } from '../reducer/reducer'

//得到距離(這邊是經緯度)少於某數的所有停車場資料
const getPointsInDistance = (datas, targetPoint, distance) => {
  if(!datas) return
  if (isNaN(distance)) return datas

  return datas.filter(data => 
    getStraightDistance(targetPoint, {lng: data.lng, lat: data.lat}) < distance)
}

//得到單一目標不同車種的剩餘車位資料
export const availableCounts = (transOption, place) => {
  if (transOption === 'car') return place.availablecar.toString()
  
  if (transOption === 'motor') return place.availablemotor.toString()
}
//得到單一目標不同車種的費率資料
const payment = (transOption, place) => {
  if (transOption === 'car') return place.pay.toString()
  
  if (transOption === 'motor') return place.pay.toString()
}

//初次合併完成的所有資料
const combinedInitAllParksData = (parks, formattedParksData, coordinatesConvert, payexFilter) => {
    const formattedParks = formattedParksData(parks, coordinatesConvert)
    const formattedParksWithPay = payexFilter(formattedParks)
    return formattedParksWithPay
}

//每次更新身邊停車場時要跑的篩選
const filteredNearParks = (basedParks, remainings, center, transOption, getPointsInDistance, parksWithRemainings, parksTransFilter, availableCounts, isShowZero) => {
    //算出與自身位置一定距離內的點
    let filteredParkingLots = getPointsInDistance(basedParks, center, 0.01)
    //將停車場資料與 remainings 資料合併
    filteredParkingLots = parksWithRemainings(filteredParkingLots, remainings)
    //將帶有最新 remainings 資料的停車場以機車or汽車篩選
    filteredParkingLots = parksTransFilter(filteredParkingLots, transOption)
    //篩選只顯示>0的
    //這邊會害cardPanel顯示全部
    const availablePark = filteredParkingLots.filter(park => availableCounts(transOption, park) > 0 )

    if (!isShowZero) return availablePark
    return filteredParkingLots
}

export default function ParkMarkerController () {
  const mode = useSelector((state) => state.map.mode)
  const selfPos = useSelector((state) => state.map.selfPos)
  const transOption = useSelector((state) => state.park.transOption)
  const markerOption = useSelector((state) => state.park.markerOption)
  const currentPark = useSelector((state) => state.park.currentPark)
  const nearParks = useSelector((state) => state.park.nearParks)
  const remainings = useSelector((state) => state.park.remainings)
  const filterConditions = useSelector((state) => state.park.filterConditions)
  const mapCenter = useSelector((state) => state.map.mapCenter)
  const target = useSelector((state) => state.map.target)
  const isShowZero = useSelector((state) => state.park.isShowZero)
  const dispatch = useDispatch()

  const { setDirections } = useContext(mapContext)
  //fetching狀態
  const [isFetchingRemaining, setIsFetchingRemaining] = useState(false)
  const [isFetchingParks, setIsFetchingParks] = useState(false)
  //內部變數
  const FETCH_INRERVAL = 20000
  //路由相關
  const location = useLocation()
  const params = useParams()
  //parkId存在的話(已經在追蹤某停車場)就放入網址
  const parkId = params.parkId
  const [allParks, setAllParks] = useState()
  const [userFilteredParks, setUserFilteredParks] = useState([])
  const currentRemainingsRef = useRef()

  //一載入就抓所有資料
  useEffect(() => {
    //先把資料抓下來
    async function fetchParksData () {
      try {
        if (isFetchingParks) return
        setIsFetchingParks(true)
        const response = await getParkingLots()
        const parks = response.data.data.park

        if(!parks) return
        const allParks = combinedInitAllParksData(parks, formattedParksData, coordinatesConvert, payexFilter)

        setAllParks(allParks)
        setIsFetchingParks(false)       
      } 
      catch (error) {
        setIsFetchingParks(false)
        console.log(error)
      }
    } 
    async function fetchRemainingData () {
      try {
        if (isFetchingRemaining) return
        setIsFetchingRemaining(true)
        const response = await getRemaining()
        const remainings = response.data.data.park
        if(!remainings) return
        dispatch(setRemainings(remainings))
        setIsFetchingRemaining(false)       
      } 
      catch (error) {
        setIsFetchingRemaining(false)
        console.log(error)
      }
    } 
    fetchParksData()
    fetchRemainingData()
    
    //20秒抓一次剩餘車位資料
    const interval = setInterval(() => {
      fetchRemainingData()
    }, FETCH_INRERVAL)
    return () => clearInterval(interval)
    
  }, [])



  //有所有停車場資料(initParkingLots)後 & 網址改變時
  useEffect(() => {
    //偵測網址上有沒有parkId要導航
    if (!allParks) return
    if (!parkId) {
      setDirections(null)
      dispatch(setCurrentPark(null))
      // setCurrentPark(null)
      return
    }

    //網址上的park id 沒找到就彈提醒窗
    const paramsPark = allParks.find(park => park.id === parkId)
    if (!paramsPark) {
      dispatch(setWarningMsg('查無此停車場'))
      // dispatch(setIsEmptyId(true))
      return
    }
    //確保拿到最新的資料
    dispatch(setCurrentPark(parksWithRemainings([paramsPark], remainings)[0]))
  }, [location, allParks])



  //剩餘車位資料成功抓進來後重新丟進 currentPark
  useEffect(() => {
    if (currentPark?.id) {
      const currentParksWithRemainings = parksWithRemainings([currentPark], remainings)[0]
      // setCurrentPark(currentParksWithRemainings)
      dispatch(setCurrentPark(currentParksWithRemainings))
    }
  }, [remainings])

  
  //selfPos 傳進來時先 fetch 停車場資料，並且用距離先篩過（因為目前selfPos不會跟著亂動所以先這樣寫）
  useEffect(() => {
    if (mode !== 'self') return
    const basedParks = userFilteredParks?.length? userFilteredParks : allParks
    const filteredParks = filteredNearParks(basedParks, remainings, selfPos, transOption, getPointsInDistance, parksWithRemainings, parksTransFilter, availableCounts, isShowZero)

    dispatch(setNearParks(filteredParks))
  }, [selfPos, mode, transOption, remainings, userFilteredParks, isShowZero])

  // target的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'target') return
    const basedParks = userFilteredParks?.length? userFilteredParks : allParks
    const filteredParks = filteredNearParks(basedParks, remainings, target, transOption, getPointsInDistance, parksWithRemainings, parksTransFilter, availableCounts, isShowZero)

    dispatch(setNearParks(filteredParks))
  }, [target, mode, transOption, remainings, userFilteredParks, isShowZero])

  // mapCenter的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'screen-center') return
    //決定以誰為基準
    const basedParks = userFilteredParks?.length? userFilteredParks : allParks
    const filteredParks = filteredNearParks(basedParks, remainings, mapCenter, transOption, getPointsInDistance, parksWithRemainings, parksTransFilter, availableCounts, isShowZero)

    dispatch(setNearParks(filteredParks))
  }, [mapCenter, mode, transOption, remainings, userFilteredParks, isShowZero])


  // filter 條件切換
  useEffect(() => {
    let filteredParkingLots = userFilterParks(filterConditions, allParks)
    setUserFilteredParks(filteredParkingLots)
  }, [filterConditions])



  //url, mapCenter, remainings 改變時檢查如果沒抓到資料就再抓一次
  useEffect(() => {
    if (!allParks) {
      async function fetchParksData () {
        try {
          if (isFetchingParks) return
          setIsFetchingParks(true)
          const response = await getParkingLots()
          const parks = response.data.data.park
          const allParks = combinedInitAllParksData(parks, formattedParksData, coordinatesConvert, payexFilter)
          setAllParks(allParks)
          setIsFetchingParks(false)       
        } 
        catch (error) {
          setIsFetchingParks(false)
          console.log(error)
        }
      } 
      fetchParksData ()
    }
  }, [mapCenter, remainings, location])



  
  useEffect(() => {
    if (!currentPark?.id) return
    //如果是一開始就>0的，再進行車位數量追蹤（為了避免點開0的也跳視窗）
    if (currentRemainingsRef.current > 0) {
      if (availableCounts(transOption, currentPark) < 1) {
        dispatch(setWarningMsg('您的目標停車場無剩餘車位'))
      }
    }
    //每次都記錄車位數量
    currentRemainingsRef.current = availableCounts(transOption, currentPark)
    console.log(currentRemainingsRef.current)
  }, [currentPark, transOption])

  //icon 的設定
  const icon = (transOption, place, isCurr) => {
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

  const label = (transOption, place, isCurr) => {
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
  //排除掉點擊中的
  const nearParksWithOutCurrent = nearParks?.filter(park => {
    if (!currentPark?.id) return park
    return park.id !== currentPark.id
  })


  //因為 state 的值更新後此 component 會重新 render，所以先判斷 state 到底存不存在
  return (
    <>
      <ParkingMark nearParksWithOutCurrent={nearParksWithOutCurrent} label={label} icon={icon} availableCounts={availableCounts}/>
    </>
  )
}
