import parkMarker from '../assets/images/marker-parking.svg'
import parkMarkerSmall from '../assets/images/marker-parking-small.svg'
import { getParkingLots, getRemaining } from '../apis/places'
import { Marker } from '@react-google-maps/api';
import { coordinatesConvert, getStraightDistance, parksTransFilter, parksWithRemainings, getNearParksTime, payexFilter, formattedParksData } from '../utils/helpers'
import { useState, useEffect, useContext, useRef } from 'react';
import { allContext } from '../pages/Home'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ReactComponent as ParkMarker } from '../assets/images/marker-parking.svg'


//從API得到所有停車場資料
const parkingLotsData = async() => {
  try {
    const response = await getParkingLots()
    if (response.status !== 200) return console.log('抓不到停車場資料')
    console.log('成功抓到停車場資料')
    return response.data.data.park
  }
  catch(error) {
    console.log('error', error)
  }
}


//從API得到剩餘停車位資料
const remainingData = async() => {
  try {
    const response = await getRemaining()
    if (response.statusText !== 'OK') return console.log('請稍後再試')
    console.log('抓到剩餘車位資料')
    return response.data.data.park
  }
  catch(error) {
    console.log('error', error)
  }
}
//得到距離(這邊是經緯度)少於某數的所有停車場資料
const getPointsInDistance = (datas, targetPoint, distance) => {
  if(!datas) return console.log('no data')
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


export default function ParkingMark () {
  const { nearParks, setNearParks, allParks, setAllParks, mode, transOption, mapCenter, target, selfPos, setDirections, currentPark, setCurrentPark, setCanFetchDirection, remainings, setRemainings, mapInstance, markerOption } = useContext(allContext)
  
  //fetching狀態
  const [isFetchingRemaining, setIsFetchingRemaining] = useState(false)
  const [isFetchingParks, setIsFetchingParks] = useState(false)
  //內部變數
  const FETCH_INRERVAL = 20000
  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const params = useParams()
  //parkId存在的話(已經在追蹤某停車場)就放入網址
  const parkId = params.parkId
  //記住網址原本的id值
  const parkIdRef = useRef()

  //一載入就抓所有資料
  useEffect(() => {
    console.log('on ParkingMark load')
    //先把資料抓下來
    async function fetchParksData () {
      try {
        if (isFetchingParks) return
        setIsFetchingParks(true)
        const parks = await parkingLotsData()

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
        const remainings = await remainingData()
        if(!remainings) return
        setRemainings(remainings) 
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
      setCurrentPark(null)
      return
    } 
    //檢查如果沒抓到資料就再抓一次
    if (!allParks) {
      console.log('重新抓取allParks資料')
      async function fetchParksData () {
        try {
          if (isFetchingParks) return
          setIsFetchingParks(true)
          const parks = await parkingLotsData()
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

    const paramsPark = allParks.find(park => park.id === parkId)
    if (!paramsPark) return console.log('轉到找不到此id頁面')
    setCurrentPark(parksWithRemainings([paramsPark], remainings)[0])
    
    //網址改變只要不是改到id 就不要推薦路線
    if(parkIdRef.current === parkId) return
    parkIdRef.current = paramsPark.id
  }, [allParks, location])

  //剩餘車位資料成功抓進來後重新丟進 currentPark
  useEffect(() => {
    if (currentPark) {
      const currentParksWithRemainings = parksWithRemainings([currentPark], remainings)[0]
      setCurrentPark(currentParksWithRemainings)
    }
    //檢查如果沒抓到資料就再抓一次
    if (!allParks) {
      console.log('重新抓取allParks資料')
      async function fetchParksData () {
        try {
          if (isFetchingParks) return
          setIsFetchingParks(true)
          const parks = await parkingLotsData()
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
  }, [remainings])

  //selfPos 傳進來時先 fetch 停車場資料，並且用距離先篩過（因為目前selfPos不會跟著亂動所以先這樣寫）
  useEffect(() => {
    if (mode !== 'self') return
    let filteredParkingLots = getPointsInDistance(allParks, selfPos, 0.0075)
    filteredParkingLots = parksWithRemainings(filteredParkingLots, remainings)
    filteredParkingLots = parksTransFilter(filteredParkingLots, transOption)
    //篩選只顯示>0的
    const availablePark = filteredParkingLots.filter(park => availableCounts(transOption, park) > 0 )

    setNearParks(availablePark)
  }, [selfPos, mode, transOption, remainings])

  // target的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'target') return
    let filteredParkingLots = getPointsInDistance(allParks, target, 0.0075)
    //加入剩餘車位資料
    filteredParkingLots = parksWithRemainings(filteredParkingLots, remainings)
    filteredParkingLots = parksTransFilter(filteredParkingLots, transOption)
    const availablePark = filteredParkingLots.filter(park => availableCounts(transOption, park) > 0 )

    setNearParks(availablePark)
  }, [target, mode, transOption, remainings])

  // mapCenter的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'screen-center') return
    let filteredParkingLots = getPointsInDistance(allParks, mapCenter, 0.0075)
    //加入剩餘車位資料
    filteredParkingLots = parksWithRemainings(filteredParkingLots, remainings)
    filteredParkingLots = parksTransFilter(filteredParkingLots, transOption)
    
    //篩掉0的
    const availablePark = filteredParkingLots.filter(park => availableCounts(transOption, park) > 0 )
    setNearParks(availablePark)
  }, [mapCenter, mode, transOption, remainings])

  //mapCenter, target改變時重新算一次時間
  useEffect(() => {
    //檢查如果沒抓到資料就再抓一次
    if (!allParks) {
      console.log('重新抓取allParks資料')
      async function fetchParksData () {
        try {
          if (isFetchingParks) return
          setIsFetchingParks(true)
          const parks = await parkingLotsData()
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
    //如果是在使用者附近就顯示五分鐘內
    if (mode === 'self') return
    // if (!selfPos || !nearParks) return
    // getNearParksTime(selfPos, nearParks, setNearParks)
  }, [mapCenter, target, location])


  //icon 的設定
  const icon = (transOption, place, isCurr) => {
    const google = window.google
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

  const nearParksWithOutCurrent = nearParks?.filter(park => {
    if (!currentPark) return park
    return park.id !== currentPark.id
  })
  //因為 state 的值更新後此 component 會重新 render，所以先判斷 state 到底存不存在
  return (
    <>
      {/* <ParkMarker className="marker__current" alt="logo" stroke="#DB7290" /> */}
      {currentPark && 
        <Marker 
        position={{lng: currentPark.lng, lat: currentPark.lat}} 
        icon={icon(transOption, currentPark, true)}
        label={label(transOption, currentPark, true)}
        zIndex={2}
        key={currentPark.id} 
      />
     }

      {nearParksWithOutCurrent && nearParksWithOutCurrent.map(park => {
        const positon = {lng: park.lng, lat: park.lat}
        // 切換這邊就可以切換要不要顯示0
        if (availableCounts(transOption, park) < 1) return <p key={park.id}></p>
        return (
          <Marker 
            icon={icon(transOption, park, false)}
            label={label(transOption, park, false)}
            // label={{
            //   text: availableCounts(transOption, park),
            //   className: 'marker',
            //   color: 'white',
            //   fontSize: '16px'
            // }}
            zIndex={1}
            className="marker"
            position={positon} 
            key={park.id} 
            // animation={window.google.maps.Animation.DROP}
            onClick={() => {
              //改變網址   如果有query就要包含上去   
              const queryStr = location.search
              navigate(`/map/${park.id}${queryStr}`, {push: true})
              setCurrentPark(park)
              // setCanFetchDirection(true)
            }} />
        )
      })}
    </>
  )
}

