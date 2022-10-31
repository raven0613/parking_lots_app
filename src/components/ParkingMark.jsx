import { getParkingLots } from '../apis/places'
import { MarkerF } from '@react-google-maps/api';
import { coordinatesConvert, getStraightDistance } from '../utils/helpers'
import { useState } from 'react';
import { useEffect } from 'react';


//得到所有停車場資料
const parkingLotsData = async() => {
  try {
    const response = await getParkingLots()
    const parks = response.data.data.park.map(park => {
        const {id, area, name, summary, address, tel, payex, serviceTime, tw97x, tw97y, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo: {...FareInfo}} = park

        //TWD97轉經緯度
        const { lng, lat } = coordinatesConvert(Number(tw97x), Number(tw97y))
        
        return {
          id, area, name, summary, address, tel, payex, serviceTime, lat, lng, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo
        }
    })
    return parks
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
  //selfPos 傳進來時先 fetch 停車場資料，並且用距離先篩過（因為目前selfPos不會跟著亂動所以先這樣寫）
  useEffect(() => {
    if (props.mode !== 'self') return
    async function fetchParkData () {
      const parks = await parkingLotsData()
      const filteredParkingLots = getPointsInDistance(parks, props.selfPos, 0.0075)
      setParkingLots(filteredParkingLots)
    } 
    fetchParkData()
  }, [props.selfPos, props.mode])

  //有 target 的資料傳進來時 fetch 資料
  useEffect(() => {
    if (props.mode !== 'target') return
    async function fetchParkData () {
      const parks = await parkingLotsData()
      console.log(parks)
      //分成以 target 為中心 或是以 selfPos 為中心
      const filteredParkingLots = getPointsInDistance(parks, props.target, 0.0075)
      setParkingLots(filteredParkingLots)
    } 
    fetchParkData()
  }, [props.target, props.mode])

  //有 target 的資料傳進來時 fetch 資料
  useEffect(() => {
    if (props.mode !== 'screen-center') return
    async function fetchParkData () {
      const parks = await parkingLotsData()
      console.log(parks)
      //分成以 mapCenter 為中心 或是以 selfPos 為中心
      const filteredParkingLots = getPointsInDistance(parks, props.mapCenter, 0.0075)
      setParkingLots(filteredParkingLots)
    } 
    fetchParkData()
  }, [props.mapCenter, props.mode])
  //因為 state 的值更新後此 component 會重新 render，所以先判斷 state 到底存不存在
  return (
    <>
      {parkingLots && parkingLots.map(place => {
        const positon = {lng: place.lng, lat: place.lat}
        return (
          <MarkerF 
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

