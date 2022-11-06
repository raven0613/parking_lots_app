import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Map from "../components/Map";
import Place from "../components/Place";
import CardPanel from '../components/card-panel/CardPanel'
import ModeController from '../components/ModeController'
import TransTypeController from '../components/TransTypeController'
import DetailPanel from '../components/DetailPanel'
import Speech from '../components/Speech'
import SecondsCounter from '../components/SecondsCounter'
import Locate from '../components/Locate'
import Footer from '../components/Footer'
import Warning from '../components/Warning'
const libraries = ["places"];


export default function Home() {
  console.log('Home又重新渲染')
  //搜尋模式
  const [mode, setMode] = useState("self") //self, target, screen-center
  //搜尋相關
  const [ speech, setSpeech ] =  useState()

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  })

  //使用者的 currentPosition
  const [selfPos, setSelfPos] = useState()
  //要顯示哪種交通工具的停車場
  const [transOption, setTransOption] = useState('car')
  //設定搜尋目標點
  const [target, setTarget] = useState();
  //設定目前點的停車場
  const [currentPark, setCurrentPark] = useState()
  //剩餘車位
  const [remainings, setRemainings] = useState()
  //導航路線
  const [directions, setDirections] = useState();
  const mapRef = useRef();
  //設定初始點
  const [mapCenter, setMapCenter] = useState({ lng: 121.46, lat: 25.041 });

  const [mapInstance, setMapInstance] = useState();
  // const center = useMemo(() => (selfPos), [selfPos])


  //設定是否要搜尋路線 的開關
  const [canFetchDirection, setCanFetchDirection] = useState(false)

  //一載入就去抓使用者的上次交通工具設定
  useEffect(() => {
    console.log("on page loaded");
    setTransOption(localStorage.getItem('transOption'))
  }, []);


  //處理目標的地址
  //這邊要記得同步去找parkId
  let targetAddressRef = useRef(null)
  const getPlaceResult = (placeValue) => {
    targetAddressRef.current = placeValue
    if (!targetAddressRef) return
    navigate(`/map?target=${targetAddressRef.current}`)
  }
  //網址改變時如果有地址就去搜尋
  useEffect(() => {
    // if (!queryParams) return
    if (queryParams.get('target')) {
      targetAddressRef.current = queryParams.get('target')
    }
  }, [location])

  








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
        canFetchDirection={canFetchDirection}
        setCanFetchDirection={setCanFetchDirection}
        remainings={remainings}
        setRemainings={setRemainings}
      />

      <div className="map__ui">
        
        <div className="search__controller">
          <Place
            getPlaceResult={getPlaceResult}
            speech={speech}
            targetAddressRef={targetAddressRef}
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
          <TransTypeController transOption={transOption} setTransOption={setTransOption}/>
        </div>
        <CardPanel 
          currentPark={currentPark} 
          selfPos={selfPos}
          directions={directions}
          setDirections={setDirections}
          setCurrentPark={setCurrentPark}
          setCanFetchDirection={setCanFetchDirection}/>
        <div className="detail__window">
          <DetailPanel currentPark={currentPark}/>
          <SecondsCounter remainings={remainings}/>
        </div>
        <ModeController setMode={setMode}/>
        <Locate setMapCenter={setMapCenter} selfPos={selfPos} mapInstance={mapInstance}/>
      </div>
      <Footer />
      <Warning 
        currentPark={currentPark} 
        transOption={transOption}
        target={target}
        setCurrentPark={setCurrentPark}
        mapRef={mapRef}/>
    </div>
  );
}

