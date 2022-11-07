// import vector from '../assets/images/cancel-orange.svg'
import centerMarker from '../assets/images/map-center.svg'
import selfMarker from '../assets/images/marker-self.svg'
import targetMarker from '../assets/images/marker-target2.svg'

import React, { useMemo, useCallback, useRef, useState, useEffect } from "react"
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api"

import ParkingMark from "./ParkingMark"



//一次性取得使用者的 currentPosition並且設為地圖中央
const getUserPos = (setSelfPos, mode, setMapCenter) => {
  console.log("getUserPos");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (setSelfPos) {
          setSelfPos(() => {
            console.log("setSelfPos");
            return {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          })
          if(mode !== 'self') return
          if(!position) return
          setMapCenter(() => {
            console.log("setMapCenter");
            return {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          });
        }
      },
      (error) => {
        console.log('無法取得您的位置', error)
      }
    );
  } else {
    //目前如果沒有允許就跑不出地圖
    alert("你的裝置不支援地理位置功能。");
  }
}

//監控使用者的 currentPosition
const watchUserPos = (setSelfPos) => {
  console.log('watchUserPos')
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        if (setSelfPos) {
          setSelfPos(() => {
            console.log("setSelfPos");
            return {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          })
        }
      },
      (error) => {
        console.log('無法取得您的位置', error)
      }
    );
  } else {
    //目前如果沒有允許就跑不出地圖
    alert("你的裝置不支援地理位置功能。");
  }
}

//獲得路線資訊
const handleFetchDirections = (origin, destination, state, setter) => {
  console.log('推薦路線')
  //如果已經有路線，就把他清除
  if (state) {
    setter(null)
  }
  if (!origin || !destination) return console.log("沒有目標");
  
  const google = window.google;

  //創建距離api的實例
  const service = new google.maps.DirectionsService();
  //調用DirectionsService.route來發送請求
  service.route(
    {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK" && result) {
        setter(result)
      }
    }
  )
}


export default function Map({mapCenter, setMapCenter, mode, mapInstance, setMapInstance, target, setTarget, setSpeech, setSelfPos, directions, setDirections, transOption, mapRef, selfPos, currentPark, setCurrentPark,  canFetchDirection, setCanFetchDirection, remainings, setRemainings, isFollow, setIsFollow}) {


  //一載入就去抓使用者的 currentPosition，並且要把地圖中心設在使用者位置
  useEffect(() => {
    console.log('Map load')
    getUserPos(setSelfPos, mode, setMapCenter)
    watchUserPos(setSelfPos)
  }, []);

  //selfPos改變的話要讓地圖中心跟隨
  useEffect(() => {
    if (!isFollow) return
    if (!selfPos) return
    if (!mapInstance) return
    if (isFollow) {
      if (!mapInstance.map) {
        return mapInstance.panTo(selfPos)
      }
      mapInstance.map.panTo(selfPos)
    }
  }, [selfPos, isFollow, mapInstance])

  //如果移動地圖就改變 center 位置
  function handleCenterChanged() {
    if (mode !== "screen-center") return
    
    // console.log('mapInstance', mapInstance)
    
    if (mapInstance.map) {
      setMapCenter(mapInstance.map.center.toJSON())
    } else {
      setMapCenter(mapInstance.center.toJSON())
    }
  }

  //地圖載入後把 map 存進 mapRef ，useCallback: 不要每次重新渲染時都再次渲染
  const onLoad = useCallback((map) => {
    console.log('地圖載入')
    if (map.map) {
      return setMapInstance(map.map)
    }
    mapRef.current = map
    return setMapInstance(map)
  }, [])

  //當搜尋 mode 改變時
  useEffect(() => {
    if (mode === 'self') {
      console.log('current mode: ', mode)
      if (!isFollow) {
        //mode回到self後恢復跟隨
        setIsFollow(true)
      }
      if (!selfPos) return
      setMapCenter(selfPos)
      setTarget(null)
      setSpeech('')
      return
    }
    if (mode === 'target') {
      console.log('current mode: ', mode)
      return
    }
    if (mode === 'screen-center') { //這邊前後都是正常地圖
      setDirections(null)
      console.log('current mode: ', mode)

      setMapCenter(selfPos)
      setTarget(null)
      setSpeech('')
      return
    }
  }, [mode])

  //網址點進來 or 點選一個新目標(marker或卡片) or 點選重新讀取路線 = 才會觸發推薦路線
  useEffect(() => {
    if (!canFetchDirection) return console.log('canfetchDirection是 false')
    if (!currentPark) return console.log('沒有點選停車場')
    const positon = {lng: currentPark.lng, lat: currentPark.lat}
    // handleFetchDirections(selfPos, positon , directions, setDirections)
    //推薦完路線就改回false
    setCanFetchDirection(false)
  }, [canFetchDirection])



  //map設定
  const options = useMemo(
    () => ({
      //在google map後台設定，不須保密
      mapId: "feb728f5023695e4",
      //地圖上的UI不顯示
      disableDefaultUI: true,
      //地圖上的標記不能點
      clickableIcons: false,
      //任何操作都可以滑動螢幕
      gestureHandling: 'greedy'
    }),
    []
  )

  return(
    <div className="map">
      <GoogleMap
        zoom={15}
        center={mapCenter}
        mapContainerClassName="map"
        onDragEnd={handleCenterChanged}
        onDragStart={() => {
          if (!isFollow) return
          setIsFollow(false)
        }}
        onZoomChanged={() => {
          if (!isFollow) return
          setIsFollow(false)
        }}
        options={options}
        onLoad={onLoad}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 10,
                strokeColor: "#33CC99",
                strokeWeight: 7,
              },
            }}
          />
        )}
        {selfPos && (
          <Marker 
            position={selfPos} 
            className="self-point marker" 
            icon={{
              url: selfMarker,
              scaledSize: { width: 32, height: 32 },
              className: 'marker'
            }}
            />
        )}
        {mapCenter && mode === "screen-center" && (
          <Marker
            className="marker"
            onLoad={onLoad}
            position={mapCenter}
            icon={{
              url: centerMarker,
              scaledSize: { width: 28, height: 28 },
              className: 'marker'
            }}
            zIndex={999}
          />
        )}
        {target && <Marker 
          position={target} 
          zIndex={998}
          icon={{
            url: targetMarker,
            scaledSize: { width: 48, height: 48 },
            className: 'marker'
          }}
          />}
        <ParkingMark 
          mode={mode}
          transOption={transOption}
          mapCenter={mapCenter}
          target={target}
          selfPos={selfPos}
          handleFetchDirections={handleFetchDirections}
          directions={directions}
          setDirections={setDirections}
          currentPark={currentPark}
          setCurrentPark={setCurrentPark}
          setCanFetchDirection={setCanFetchDirection}
          remainings={remainings}
          setRemainings={setRemainings}
        />
      </GoogleMap>
    </div>
  )

}
