// import vector from '../assets/images/cancel-orange.svg'
import centerMarker from '../assets/images/map-center.svg'
import targetMarker from '../assets/images/marker-target2.svg'

import React, { useMemo, useCallback, useEffect, useContext, useState } from "react"
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript, useJsApiLoader } from "@react-google-maps/api"
import { useLocation, useNavigate } from 'react-router-dom'

import ParkMarkerController from "./ParkMarkerController"
import SelfMarker from "./SelfMarker"
import { handleFetchDirections, getUserPos, watchUserPos } from '../utils/mapHelpers'

import { mapContext } from '../store/UIDataProvider'
import { darkStyle, lightStyle } from '../assets/styles/mapStyles'

import { useSelector, useDispatch } from 'react-redux'
import { setIsLocateDenied, setMode, setSelfPos, setMapCenter, setCanFetchDirection, setIsFollow, setWarningMsg, setCurrentPark } from '../reducer/reducer'



export default function Map({setIsGoogleApiLoaded, allParks, weather}) {
  const currentPark = useSelector((state) => state.park.currentPark)
  const selfPos = useSelector((state) => state.map.selfPos)
  const mode = useSelector((state) => state.map.mode)
  const mapCenter = useSelector((state) => state.map.mapCenter)
  const target = useSelector((state) => state.map.target)
  const canFetchDirection = useSelector((state) => state.map.canFetchDirection)
  const isFollow = useSelector((state) => state.map.isFollow)
  const isLocateDenied = useSelector((state) => state.map.isLocateDenied)
  const mapStyleChange = useSelector((state) => state.map.mapStyleChange)
  const dispatch = useDispatch()

  //定義來源名稱
  const { mapInstance, setMapInstance, directions, setDirections } = useContext(mapContext)
  
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)

  const [libraries] = useState(["places"])
  const [mapStyle, setMapStyle] = useState(lightStyle)

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: libraries,
    optimized: false
  })
  useEffect(() => {
    if(!isLoaded || !setIsGoogleApiLoaded) return
    setIsGoogleApiLoaded(true)
  }, [isLoaded, setIsGoogleApiLoaded])

  useEffect(() => {
    if (mapStyleChange === 'light') {
      setMapStyle(lightStyle)
    }
    else if (mapStyleChange === 'dark') {
      setMapStyle(darkStyle)
    }
  }, [mapStyleChange])


  //網址改變就去抓使用者的 currentPosition，並且要把地圖中心設在使用者位置
  useEffect(() => {
    if (isLocateDenied) return

    watchUserPos(dispatch, setSelfPos, setMapCenter, setMode, setIsLocateDenied, setWarningMsg)
    if (location.search) return

    getUserPos(dispatch, setSelfPos, mode, setMapCenter, setMode, setIsLocateDenied, setWarningMsg)
    //setMapCenter({lat: 25.0408065, lng: 121.5397976})   //北車的點
  }, [location]);

  
  //偵測網路狀況
  useEffect(() => {
    if (navigator.onLine) return
    dispatch(setWarningMsg('無法取得資料，請確認您的網路狀況'))
  }, [mapCenter])
  

  //selfPos改變的話要讓地圖中心跟隨
  useEffect(() => {
    if (mode !== 'self') return
    if (!isFollow) return
    if (!selfPos?.lat) return
    if (!mapInstance) return

    if (!mapInstance.map) {
      return mapInstance.panTo(selfPos)
    }
    mapInstance.map.panTo(selfPos)
    
  }, [selfPos, isFollow, mapInstance])

  //如果移動地圖就改變 center 位置
  function handleCenterChanged() {
    if (mode !== "screen-center") return
    
    if (mapInstance.map) {
      dispatch(setMapCenter(mapInstance.map.center.toJSON()))
      // mapInstance.map.panTo(mapInstance.map.center.toJSON())
    } else {
      // mapInstance.panTo(mapInstance.center.toJSON())
      dispatch(setMapCenter(mapInstance.center.toJSON()))
    }
  }
  

  //地圖載入後把 map 存進 mapRef ，useCallback: 不要每次重新渲染時都再次渲染
  const onLoad = useCallback((map) => {
    if (map.map) {
      return setMapInstance(map.map)
    }
    return setMapInstance(map)
  }, [setMapInstance])

  //當搜尋 mode 改變時
  useEffect(() => {
    if (mode === 'self') {

      if (!isFollow) {
        //mode回到self後恢復跟隨
        dispatch(setIsFollow(true))
      }
      if (!selfPos?.lat) watchUserPos(dispatch, setSelfPos, setMapCenter, setMode, setIsLocateDenied, setWarningMsg)  //沒抓到就再抓
    
      dispatch(setMapCenter(selfPos))
      return
    }
    if (mode === 'target') {
      return
    }
    if (mode === 'screen-center') {
      return
    }
  }, [mode])

  //網址點進來 or 點選一個新目標(marker或卡片) or 點選重新讀取路線 = 才會觸發推薦路線
  useEffect(() => {
    if (!canFetchDirection) return
    if (!currentPark?.id) return
    const positon = {lng: currentPark.lng, lat: currentPark.lat}
    handleFetchDirections(selfPos, positon , directions, setDirections)
    //推薦完路線就改回false
    dispatch(setCanFetchDirection(false))
  }, [canFetchDirection])

  //map設定
  const options = useMemo(
    () => ({
      //在google map後台設定，不須保密（要自訂樣式的話不可以有id）
      // mapId: 'feb728f5023695e4',
      //地圖上的UI不顯示
      disableDefaultUI: true,
      //地圖上的標記不能點
      clickableIcons: false,
      //任何操作都可以滑動螢幕
      gestureHandling: 'greedy',
      styles: mapStyle
    }),
    [mapStyle]
  )

  return(
    <>
      {isLoaded && <div className="map">
        <GoogleMap
          onClick={() => {
            dispatch(setCurrentPark(''))
            //網址也要變
            if (queryParams.has('target')) {
              return navigate(`/map?target=${queryParams.get('target')}`)
            }
            return navigate(`/map`)
          }}
          zoom={15}
          center={mapCenter}
          mapContainerClassName="map"
          onDragEnd={() => {
            handleCenterChanged()
          }}
          onDragStart={() => {
            dispatch(setIsFollow(false))
            dispatch(setMode('screen-center'))
          }}
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  zIndex: 10,
                  strokeColor: "#33CC99",
                  strokeWeight: 7,
                },
              }}
            />
          )}
          {selfPos?.lat && (
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

          {target?.lat && <Marker 
            position={target} 
            zIndex={998}
            icon={{
              url: targetMarker,
              scaledSize: { width: 48, height: 48 },
              className: 'marker'
            }}
            />}
          <ParkMarkerController allParks={allParks} weather={weather}/>
        </GoogleMap>
      </div>}
    </>
  )

}
