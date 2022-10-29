import { getParkingLots } from '../apis/places'
import { MarkerF } from '@react-google-maps/api';
import { coordinatesConvert, getStraightDistance } from '../utils/helpers'
import { useState } from 'react';


//得到所有停車場資料
const parkingLotsData = async(setParkingLots) => {
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
    setParkingLots(parks)
  }
  catch(error) {
    console.log('error', error)
  }
}
//得到距離少於某數的所有停車場資料
const getPointsInDistance = (datas, targetPoint, distance) => {
  console.log(datas)
  if(!datas.length) return console.log('no data')
  if (isNaN(distance)) return datas

  return datas.filter(data => 
    getStraightDistance(targetPoint, {lng: data.lng, lat: data.lat}) < distance)
}


export default function ParkingMark ({setParkingLots}) {

  // parkingLotsData(setParkingLots)

  
  // const filteredParkingLots = getPointsInDistance(parkingLots , {lng: 25.0467312, lat: 121.5119929}, 500)

  // console.log('filteredParkingLots', filteredParkingLots)
  return (
    <>
      <MarkerF />
    </>
    
  )
}