// import vector from '../assets/images/cancel-orange.svg'
import centerMarker from '../assets/images/map-center.svg'
import selfMarker from '../assets/images/marker-self.svg'
import targetMarker from '../assets/images/marker-target2.svg'

import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Place from "./Place";
import ParkingMark from "./ParkingMark";
import CardPanel from './card-panel/CardPanel'
import ModeController from './ModeController'
import TransTypeController from './TransTypeController'
import DetailPanel from './DetailPanel'
import Speech from './Speech'
const libraries = ["places"];

//取得使用者的 currentPosition
const getUserPos = (setSelfPos, setMapCenter) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (setSelfPos) {
          setSelfPos(() => {
            console.log("setSelfPos");
            return {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          });
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
        console.log(error);
      }
    );
  } else {
    //目前如果沒有允許就跑不出地圖
    alert("你的裝置不支援地理位置功能。");
  }
};

//獲得路線資訊
const handleFetchDirections = (origin, destination, state, setter) => {
  console.log(origin, destination)
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
        //如果已經有路線，就把他清除
        if (state) {
          setter(null);
        }
        setter(result);
      }
    }
  )
}

export const parkingContext = React.createContext('')





export default function Map(props) {
  const [mode, setMode] = useState("self"); //self, target, screen-center
  //使用者的 currentPosition
  const [selfPos, setSelfPos] = useState();
  const [transOption, setTransOption] = useState('car');
  const { speechRef } = props

  //一載入就去抓使用者的 currentPosition
  useEffect(() => {
    console.log("on page loaded");
    getUserPos(setSelfPos, setMapCenter);
    setTransOption(localStorage.getItem('transOption'))
  }, []);

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });
  //設定搜尋目標點
  const [target, setTarget] = useState();
  const [directions, setDirections] = useState();
  const mapRef = useRef();
  //設定初始點
  const [mapCenter, setMapCenter] = useState({ lng: 121.46, lat: 25.041 });

  const [mapInstance, setMapInstance] = useState();
  // const center = useMemo(() => (selfPos), [selfPos])
  const options = useMemo(
    () => ({
      //在google map後台設定，不須保密
      mapId: "feb728f5023695e4",
      //地圖上的UI不顯示
      disableDefaultUI: true,
      //地圖上的標記不能點
      clickableIcons: false,
    }),
    []
  );

  //地圖載入後把 map 存進 mapRef ，useCallback: 不要每次重新渲染時都再次渲染
  const onLoad = useCallback((map) => {
    console.log('load map')
    mapRef.current = map
    setMapInstance(map)
  }, []);

  //如果移動地圖就改變 center 位置
  function handleCenterChanged() {
    if (mode !== "screen-center") return console.log(mode);
    
    console.log('mapInstance', mapInstance)
    
    if (mapInstance.map) {
      setMapCenter(mapInstance.map.center.toJSON());
    } else {
      setMapCenter(mapInstance.center.toJSON());
    }
  }

  useEffect(() => {
    setDirections(null)
    if (mode === 'self') {
      console.log('current mode: ', mode)
      getUserPos(setSelfPos, setMapCenter)
      setTarget(null)
      return
    }
    if (mode === 'target') {
      console.log('current mode: ', mode)
      return
    }
    if (mode === 'screen-center') {
      console.log('current mode: ', mode)
      console.log('mapRef.current: ', mapRef.current)
      setMapCenter(mapRef.current.position.toJSON());
      setTarget(null)
      return
    }
  }, [mode])

  
  const parkingRef = useRef()

  if (!isLoaded) return <p>Loading...</p>;
  return (
    <>
      <div className="map">
        <GoogleMap
          zoom={15}
          center={mapCenter}
          mapContainerClassName="map"
          onDragEnd={handleCenterChanged}
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
          {selfPos && mode === "self" && (
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
            zIndex={999}
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
            parkingRef={parkingRef}
          />
        </GoogleMap>
      </div>

      <div className="map__ui">
        
        <div className="controller">
          <Place
            speechRef={speechRef}
            setTarget={(position) => {
              //輸入 target 後，模式切換成 target
              setMode("target");
              setTarget(position);
              //移動地圖中心至 target
              // mapRef.current?.panTo(position)
              setMapCenter(position);
            }}
          ></Place>
          <Speech speechRef={speechRef}></Speech>
        </div>
        <parkingContext.Provider value={parkingRef.current}>
            <CardPanel />
        </parkingContext.Provider>

        <DetailPanel />
        <TransTypeController transOption={transOption} setTransOption={setTransOption}/>
        <ModeController setMode={setMode}/>
        
      </div>
    </>
  );
}
