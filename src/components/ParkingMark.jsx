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





export default function ParkingMark (props) {
  const [parkingLots, setParkingLots] = useState()
  const [remainings, setRemainings] = useState()

  useEffect(() => {
    async function fetchRemainData () {
      const remains = await remainingData()
      console.log(remains)
      setRemainings(remains)
    } 
    fetchRemainData ()
  }, [])
  //selfPos 傳進來時先 fetch 停車場資料，並且用距離先篩過（因為目前selfPos不會跟著亂動所以先這樣寫）
  useEffect(() => {
    if (props.mode !== 'self') return
    async function fetchParkData () {
      const parks = await parkingLotsData()
      let filteredParkingLots = getPointsInDistance(parks, props.selfPos, 0.0075)
      if (remainings) {
        filteredParkingLots = filteredParkingLots.map(park => {
          return remainings.forEach(r => {
            if (r.id === park.id) {
              return { ...park, 
                availablecar: r.availablecar, 
                availablemotor: r.availablemotor }
            }
            return park
          })
        })
        return setParkingLots(filteredParkingLots)
      }
      setParkingLots(filteredParkingLots)
    } 
    fetchParkData()
  }, [props.selfPos, props.mode, remainings])

  //有 target 的資料傳進來時 fetch 資料
  useEffect(() => {
    if (props.mode !== 'target') return
    async function fetchParkData () {
      const parks = await parkingLotsData()
      //分成以 target 為中心 或是以 selfPos 為中心
      let filteredParkingLots = getPointsInDistance(parks, props.target, 0.0075)
      
      if (remainings) {
        const a = filteredParkingLots.map(park => {
          return remainings.forEach(rm => {
            if (rm.id === park.id) {
              console.log(park.availablecar, rm.availablecar)
              return { ...park, 
                availablecar: rm.availablecar > 0?  rm.availablemotor : 0,
                availablemotor: rm.availablemotor > 0? rm.availablemotor : 0 }
            }
          })
        })
        console.log(a)
        return setParkingLots(filteredParkingLots)
      }
      // setParkingLots(filteredParkingLots)
    } 
    fetchParkData()
  }, [props.target, props.mode, remainings])

  // mapCenter 的資料改變時 fetch 資料
  useEffect(() => {
    if (props.mode !== 'screen-center') return
    async function fetchParkData () {
      const parks = await parkingLotsData()
      
      //分成以 mapCenter 為中心 或是以 selfPos 為中心
      let filteredParkingLots = getPointsInDistance(parks, props.mapCenter, 0.0075)
      
      if (remainings && filteredParkingLots) {
        filteredParkingLots = filteredParkingLots.map(park => {
          const data = remainings.find(rm => rm.id === park.id)
          if (data) {
            return {
              ...park,
              availablecar: data.availablecar > 0?  data.availablecar : 0,
              availablemotor: data.availablemotor > 0? data.availablemotor : 0
            }
          }
          return park
        })
        setParkingLots(filteredParkingLots)
      }
      setParkingLots(filteredParkingLots)
    } 
    fetchParkData()
  }, [props.mapCenter, props.mode, remainings])
  
  //因為 state 的值更新後此 component 會重新 render，所以先判斷 state 到底存不存在
  return (
    <>
      {parkingLots && parkingLots.map(place => {
        const positon = {lng: place.lng, lat: place.lat}
        return (
          <Marker 
            className="marker"
            position={positon} 
            key={place.id} 
            onClick={() => {
              props.handleFetchDirections(props.selfPos, positon, props.directions, props.setDirections)
            }} />
        )
      })}
    </>
  )
}

