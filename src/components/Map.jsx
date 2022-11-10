// import vector from '../assets/images/cancel-orange.svg'
import centerMarker from '../assets/images/map-center.svg'
import selfMarker from '../assets/images/marker-self.svg'
import targetMarker from '../assets/images/marker-target2.svg'

import React, { useMemo, useCallback, useEffect, useContext } from "react"
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api"
import { useLocation } from 'react-router-dom'

import ParkingMark from "./ParkingMark"
import SelfMarker from "./SelfMarker"
import { handleFetchDirections, getUserPos, watchUserPos } from '../utils/helpers'

import { allContext } from '../pages/Home'




export default function Map() {

  const { mapCenter, setMapCenter, mode, setMode, mapInstance, setMapInstance, target, setTarget, setSpeech, setSelfPos, directions, setDirections, transOption, mapRef, selfPos, currentPark, setCurrentPark,  canFetchDirection, setCanFetchDirection, remainings, setRemainings, isFollow, setIsFollow, setInputingVal } = useContext(allContext)

  const location = useLocation()
  //一載入就去抓使用者的 currentPosition，並且要把地圖中心設在使用者位置
  useEffect(() => {
    console.log('Map load')
  }, []);

  //網址改變就去抓使用者的 currentPosition，並且要把地圖中心設在使用者位置
  useEffect(() => {
    if (selfPos) return
    watchUserPos(setSelfPos)
    if (location.search) return
    getUserPos(setSelfPos, mode, setMapCenter)
    // setMapCenter({lat: 25.0408065, lng: 121.5397976})   //北車的點
  }, [location]);

  //selfPos改變的話要讓地圖中心跟隨
  useEffect(() => {
    if (mode !== 'self') return
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
    
    if (mapInstance.map) {
      setMapCenter(mapInstance.map.center.toJSON())
      // mapInstance.map.panTo(mapInstance.map.center.toJSON())
    } else {
      // mapInstance.panTo(mapInstance.center.toJSON())
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
      if (!selfPos) watchUserPos(setSelfPos)  //沒抓到就再抓
      setMapCenter(selfPos)
      // setTarget(null)
      // setSpeech('')
      // setInputingVal('')
      setSelfPos(selfPos)
      
      return
    }
    if (mode === 'target') {
      console.log('current mode: ', mode)
      return
    }
    if (mode === 'screen-center') {
      console.log('current mode: ', mode)

      // setDirections(null)
      // setTarget(null)
      // setInputingVal('')
      // setSpeech('')
      return
    }
  }, [mode])

  //網址點進來 or 點選一個新目標(marker或卡片) or 點選重新讀取路線 = 才會觸發推薦路線
  useEffect(() => {
    if (!canFetchDirection) return console.log('canfetchDirection是 false')
    if (!currentPark) return console.log('沒有點選停車場')
    const positon = {lng: currentPark.lng, lat: currentPark.lat}
    handleFetchDirections(selfPos, positon , directions, setDirections)
    //推薦完路線就改回false
    setCanFetchDirection(false)
  }, [canFetchDirection])


  //map設定
  const options = useMemo(
    () => ({
      //在google map後台設定，不須保密
      mapId: 'feb728f5023695e4',
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
        onDragEnd={() => {
          handleCenterChanged()
        }}
        onDragStart={() => {
          setIsFollow(false)
          setMode('screen-center')
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
        {/* {selfPos && (
          <Marker 
            position={selfPos} 
            className="self-point marker" 
            animation={window.google.maps.Animation.DROP}
            icon={{
              url: selfMarker,
              scaledSize: { width: 32, height: 32 },
              className: 'marker'
            }}
            />
        )} */}
        {selfPos && (
          <SelfMarker  selfPos={selfPos}/>
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
        <ParkingMark />
      </GoogleMap>
    </div>
  )

}
