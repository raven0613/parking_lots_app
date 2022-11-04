import parkMarker from '../assets/images/marker-parking.svg'
import parkMarkerSmall from '../assets/images/marker-parking-small.svg'
import { getParkingLots, getRemaining } from '../apis/places'
import { Marker } from '@react-google-maps/api';
import { coordinatesConvert, getStraightDistance } from '../utils/helpers'
import { useState, useEffect, useContext } from 'react';
import { allContext } from '../App'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

//我現在要開始改了喔QQ
//得到所有停車場資料
const parkingLotsData = async() => {
  try {
    const response = await getParkingLots()
    if (response.status !== 200) return console.log('請稍後再試')
    console.log('抓到停車場資料')
    const parks = response.data.data.park.map(park => {
        const {id, area, name, summary, address, tel, payex, serviceTime, tw97x, tw97y, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo: {...FareInfo}} = park
        
        //TWD97轉經緯度
        const { lng, lat } = coordinatesConvert(Number(tw97x), Number(tw97y))
        return {
          id, area, name, summary, address, tel, payex, serviceTime, lat, lng, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo, availablecar: 0, availablemotor: 0
        }
    })
    return parks
  }
  catch(error) {
    console.log('error', error)
  }
}

//得到剩餘停車位資料
const remainingData = async() => {
  try {
    const response = await getRemaining()
    if (response.status !== 200) return console.log('請稍後再試')
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

//篩選汽車/機車資料
const parkingsTransFilter = (parkings, transOption) => {
  if(!parkings) {
    console.log('[trans]no parking data')
    return []
  } 
  if (transOption === 'car') {
    return parkings.filter(park => park.totalcar !== 0)
  }
  if (transOption === 'motor') {
    return parkings.filter(park => park.totalmotor !== 0)
  }
}
//把剩餘車位的資料合併進停車場資料(回傳陣列資料)
const parkingsWithRemainings = (parkings, remainings) => {
  if (!parkings) {
    console.log('combine remainings - no parkings data')
    return []
  }
  if (!remainings) {
    console.log('combine remainings - no remainings data')
    return parkings
  }
  return parkings.map(park => {
    //find 找出 id 相符的資料
    const data = remainings.find(rm => rm.id === park.id)
    if (data) {
      return {
        ...park,
        FareInfo: {...park.FareInfo},
        availablecar: data.availablecar > 0?  data.availablecar : 0,
        availablemotor: data.availablemotor > 0? data.availablemotor : 0
      }
    }
    //沒找到就返回原資料
    return park
  }) 
}
const availableCounts = (transOption, place) => {
  if (transOption === 'car') return place.availablecar.toString()
  
  if (transOption === 'motor') return place.availablemotor.toString()
}



export default function ParkingMark (props) {
  //props
  const { mode, transOption, mapCenter, target, selfPos, handleFetchDirections, directions, setDirections, currentPark, setCurrentPark } = props
  const { parkingLots, setParkingLots } = useContext(allContext)
  //資料
  const [initParkingLots, setInitParkingLots] = useState()
  // const [parkingLots, setParkingLots] = useState()
  const [remainings, setRemainings] = useState()
  //fetching狀態
  const [isFetchingRemaining, setIsFetchingRemaining] = useState(false)
  const [isFetchingParks, setIsFetchingParks] = useState(false)
  //內部變數
  const FETCH_PER_SEC = 20000000
  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  //parkId存在的話(已經在追蹤某停車場)就放入網址
  const parkId = params.parkId


  //有所有停車場資料(initParkingLots)後 & 網址改變時
  useEffect(() => {
    //偵測網址上有沒有parkId要導航
    if (!initParkingLots) return
    if (!parkId) {
      setDirections(null)
      setCurrentPark(null)
      return
    } 
    const paramsPark = initParkingLots.find(park => park.id === parkId)
    if (!paramsPark) return console.log('轉到找不到此id頁面')
    const positon = {lng: paramsPark.lng, lat: paramsPark.lat}
    // handleFetchDirections(selfPos, positon, directions, setDirections)
    setCurrentPark(paramsPark)
  }, [initParkingLots, location])


  useEffect(() => {
    console.log('on ParkingMark load')
    //先把資料抓下來
    async function fetchParksData () {
      try {
        if (isFetchingParks) return
        setIsFetchingParks(true)
        const parks = await parkingLotsData()

        // let a = parks.filter(park => park.FareInfo?.Holiday)

        setInitParkingLots(parks) 
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
    }, FETCH_PER_SEC)
    return () => clearInterval(interval)

  }, [])


  //selfPos 傳進來時先 fetch 停車場資料，並且用距離先篩過（因為目前selfPos不會跟著亂動所以先這樣寫）
  useEffect(() => {
    if (mode !== 'self') return
    let filteredParkingLots = getPointsInDistance(initParkingLots, selfPos, 0.0075)
    filteredParkingLots = parkingsWithRemainings(filteredParkingLots, remainings)
    setParkingLots(parkingsTransFilter(filteredParkingLots, transOption))
  }, [selfPos, mode, transOption, remainings])

  // target的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'target') return
    let filteredParkingLots = getPointsInDistance(initParkingLots, target, 0.0075)
    //加入剩餘車位資料
    filteredParkingLots = parkingsWithRemainings(filteredParkingLots, remainings)
    setParkingLots(parkingsTransFilter(filteredParkingLots, transOption))
  }, [target, mode, transOption, remainings])

  // mapCenter的資料改變 / mode切換 / transOption切換 / remainings資料更新時 => 篩選要顯示的資料
  useEffect(() => {
    if (mode !== 'screen-center') return
    let filteredParkingLots = getPointsInDistance(initParkingLots, mapCenter, 0.0075)
    //加入剩餘車位資料
    filteredParkingLots = parkingsWithRemainings(filteredParkingLots, remainings)
    // setParkingLots(parkingsTransFilter(filteredParkingLots, transOption))

    const availablePark = filteredParkingLots.filter(park => availableCounts(transOption, park) > 0 )
    setParkingLots(availablePark)
  }, [mapCenter, mode, transOption, remainings])



  //icon 的設定
  const icon = (transOption, place) => {
    if (availableCounts(transOption, place) < 10) {
      return {
        url: parkMarkerSmall,
        scaledSize: { width: 44, height: 44 },
      }
    }
    return {
      url: parkMarker,
      scaledSize: { width: 52, height: 52 },
    }
  }
  //因為 state 的值更新後此 component 會重新 render，所以先判斷 state 到底存不存在
  return (
    <>
      {parkingLots && parkingLots.map(park => {
        const positon = {lng: park.lng, lat: park.lat}
        if (availableCounts(transOption, park) < 1) return <p key={park.id}></p>
        return (
          <Marker 
            icon={icon(transOption, park)}
            label={{
              text: availableCounts(transOption, park),
              className: 'marker',
              color: 'white',
              fontSize: '16px'
            }}
            zIndex={1}
            className="marker"
            position={positon} 
            key={park.id} 
            onClick={() => {
              //改變網址
              navigate(`/map/${park.id}`, {push: true})
              
              //觸發推薦路線
              // handleFetchDirections(selfPos, positon, directions, setDirections)
              setCurrentPark(park)
            }} />
        )
      })}
    </>
  )
}

