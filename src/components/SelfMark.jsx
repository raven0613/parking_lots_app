import { MarkerF } from '@react-google-maps/api';
import { useEffect } from 'react';
import { useState } from 'react'

const getUserPos = (setSelfPos) => {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelfPos({lat: position.coords.latitude, lng: position.coords.longitude})
          return
        },
        (error) => {
          console.log(error)
        }
      );

  } else {
    alert('你的裝置不支援地理位置功能。')
  }
}


export default function SelfMark () {
  const [selfPos, setSelfPos] = useState()
  useEffect(() => {
    getUserPos(setSelfPos)
  }, [])
  return (
    <>
      <MarkerF position={selfPos}/>
    </>
    
  )
}


// const getUserPos = () => {
//   if(navigator.geolocation) {
//     // 使用者不提供權限，或是發生其它錯誤
//     function error() {
//       alert('無法取得你的位置');
//     }

//     // 使用者允許抓目前位置，回傳經緯度
//     function success(position) {
//       return({lat: position.coords.latitude, lng: position.coords.longitude})
//       // setSelfPos({lat: position.coords.latitude, lng: position.coords.longitude})
//     }
//     // 跟使用者拿所在位置的權限
//     //比較快速但精確度有差
//     navigator.geolocation.getCurrentPosition(success, error);
//     //較慢拿到結果但是比校準，也支援移動時改變座標
//     // navigator.geolocation.watchPosition(success, error);
    
//     // const watchID = navigator.geolocation.watchPosition(success, error);
//     //可取消註冊
//     // navigator.geolocation.clearWatch(watchID);

//   } else {
//     alert('Sorry, 你的裝置不支援地理位置功能。')
//   }
// }