import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Map from "../components/Map";
import Place from "../components/Place";
import CardPanel from '../components/card-panel/CardPanel'
import ModeController from '../components/ModeController'
import TransTypeController from '../components/TransTypeController'
import DetailPanel from '../components/DetailPanel'
import Speech from '../components/Speech'
const libraries = ["places"];



export const parkingContext = React.createContext('')



export default function Home() {
  //搜尋模式
  const [mode, setMode] = useState("self") //self, target, screen-center
  //搜尋相關
  const [ speech, setSpeech ] =  useState()
  let targetAddress = null
  const getPlaceResult = (placeValue) => {
    targetAddress = placeValue
    if (!targetAddress) return
    navigate(`/map?target=${targetAddress}`)
  }

  //使用者的 currentPosition
  const [selfPos, setSelfPos] = useState()
  //路由相關
  const navigate = useNavigate()
  const location = useLocation()


  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  })

  
  //要顯示哪種交通工具的停車場
  const [transOption, setTransOption] = useState('car')
  //設定搜尋目標點
  const [target, setTarget] = useState();
  //設定目前點的停車場
  const [currentPark, setCurrentPark] = useState();
  //導航路線
  const [directions, setDirections] = useState();
  const mapRef = useRef();
  //設定初始點
  const [mapCenter, setMapCenter] = useState({ lng: 121.46, lat: 25.041 });

  const [mapInstance, setMapInstance] = useState();
  // const center = useMemo(() => (selfPos), [selfPos])



  //一載入就去抓使用者的上次交通工具設定
  useEffect(() => {
    console.log("on page loaded");
    setTransOption(localStorage.getItem('transOption'))
  }, []);





  if (!isLoaded) return <p>Loading...</p>;
  return (
    <div className="map__container">
      <Map 
        mapCenter={mapCenter}
        setMapCenter={setMapCenter}
        mode={mode}
        mapInstance={mapInstance}
        setMapInstance={setMapInstance}
        target={target}
        setTarget={setTarget}
        setSpeech={setSpeech}
        setSelfPos={setSelfPos}
        directions={directions}
        setDirections={setDirections}
        transOption={transOption}
        mapRef={mapRef}
        selfPos={selfPos}
        currentPark={currentPark}
        setCurrentPark={setCurrentPark}
      />

      <div className="map__ui">
        
        <div className="controller">
          <Place
            getPlaceResult={getPlaceResult}
            speech={speech}
            setTarget={(position) => {
              //輸入 target 後，模式切換成 target
              setMode("target");
              setTarget(position);
              console.log(position)
              //移動地圖中心至 target
              // mapRef.current?.panTo(position)
              setMapCenter(position);
            }}
          ></Place>
          <Speech setSpeech={setSpeech}></Speech>
        </div>
        <CardPanel 
          currentPark={currentPark} 
          selfPos={selfPos}
          directions={directions}
          setDirections={setDirections}
          setCurrentPark={setCurrentPark}/>
        <DetailPanel currentPark={currentPark}/>
        <TransTypeController transOption={transOption} setTransOption={setTransOption}/>
        <ModeController setMode={setMode}/>
        
      </div>
    </div>
  );
}

