import parkMarker from '../assets/images/marker-parking.svg'
import parkMarkerSmall from '../assets/images/marker-parking-small.svg'
import { getParkingLots, getRemaining } from '../apis/places'
import { Marker } from '@react-google-maps/api';
import { coordinatesConvert, getStraightDistance } from '../utils/helpers'
import { useState } from 'react';
import { useEffect } from 'react';


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
  const { mode, transOption, mapCenter, target, selfPos, handleFetchDirections, directions, setDirections} = props
  //資料
  const [initParkingLots, setInitParkingLots] = useState()
  const [parkingLots, setParkingLots] = useState()
  const [remainings, setRemainings] = useState()
  //fetching狀態
  const [isFetchingRemaining, setIsFetchingRemaining] = useState(false)
  const [isFetchingParks, setIsFetchingParks] = useState(false)
  //內部變數
  const FETCH_PER_SEC = 20000


  useEffect(() => {
    console.log('on ParkingMark load')
    //先把資料抓下來
    async function fetchParksData () {
      try {
        if (isFetchingParks) return
        setIsFetchingParks(true)
        const parks = await parkingLotsData()
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

  //有 target 的資料傳進來時 fetch 資料
  useEffect(() => {
    if (mode !== 'target') return
    let filteredParkingLots = getPointsInDistance(initParkingLots, target, 0.0075)
    //加入剩餘車位資料
    filteredParkingLots = parkingsWithRemainings(filteredParkingLots, remainings)
    setParkingLots(parkingsTransFilter(filteredParkingLots, transOption))
  }, [target, mode, transOption, remainings])

  // mapCenter 的資料改變時 fetch 資料
  useEffect(() => {
    if (mode !== 'screen-center') return
    let filteredParkingLots = getPointsInDistance(initParkingLots, mapCenter, 0.0075)
    //加入剩餘車位資料
    filteredParkingLots = parkingsWithRemainings(filteredParkingLots, remainings)
    setParkingLots(parkingsTransFilter(filteredParkingLots, transOption))
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
      {parkingLots && parkingLots.map(place => {
        const positon = {lng: place.lng, lat: place.lat}
        if (availableCounts(transOption, place) < 1) return <p key={place.id}></p>
        return (
          <Marker 
            icon={icon(transOption, place)}
            label={{
              text: availableCounts(transOption, place),
              className: 'marker',
              color: 'white',
              fontSize: '16px'
            }}
            zIndex={1}
            className="marker"
            position={positon} 
            key={place.id} 
            onClick={() => {
              handleFetchDirections(selfPos, positon, directions, setDirections)
            }} />
        )
      })}
    </>
  )
}

