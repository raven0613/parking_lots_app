import { Marker } from '@react-google-maps/api';
// import { useState } from 'react'




export default function SelfMark () {
  // const [selfPos, setSelfPos] = useState()

  // 先確認使用者裝置能不能抓地點
  if(navigator.geolocation) {
    // 使用者不提供權限，或是發生其它錯誤
    function error() {
      alert('無法取得你的位置');
    }

    // 使用者允許抓目前位置，回傳經緯度
    function success(position) {
      console.log(position.coords.latitude, position.coords.longitude);
      return({lat: position.coords.latitude, lng: position.coords.longitude})
      // setSelfPos({lat: position.coords.latitude, lng: position.coords.longitude})
    }
    // 跟使用者拿所在位置的權限
    //比較快速但精確度有差
    navigator.geolocation.getCurrentPosition(success, error);
    //較慢拿到結果但是比校準，也支援移動時改變座標
    // navigator.geolocation.watchPosition(success, error);
    
    // const watchID = navigator.geolocation.watchPosition(success, error);
    //可取消註冊
    // navigator.geolocation.clearWatch(watchID);

  } else {
    alert('Sorry, 你的裝置不支援地理位置功能。')
  }
  return (
    <>
      <Marker position={{lat: 25.0117, lng: 121.4658}}/>
    </>
    
  )
}