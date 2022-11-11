import React, { useRef, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useNavigate, useLocation } from 'react-router-dom'
import Map from "../components/Map";
import Place from "../components/Place";
import CardPanel from '../components/card-panel/CardPanel'
import TransTypeController from '../components/TransTypeController'
import MarkerController from '../components/MarkerController'
import DetailPanel from '../components/DetailPanel'
import Speech from '../components/Speech'
import SecondsCounter from '../components/SecondsCounter'
import Locate from '../components/Locate'
import FilterPanel from '../components/FilterPanel'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Warning from '../components/Warning'

export const allContext = React.createContext('')
const libraries = ["places"]

//我要開始搬移全域資料囉
export default function Home() {
  // console.log('Home又重新渲染')
  //搜尋模式
  const [mode, setMode] = useState("self") //self, target, screen-center, filter
  //搜尋相關
  const [ speech, setSpeech ] =  useState()

  //路由相關
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)


  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries
  })

  //使用者的 currentPosition
  const [selfPos, setSelfPos] = useState()
  //要顯示哪種交通工具的停車場
  const [transOption, setTransOption] = useState('car')
  //要顯示費率還是位子
  const [markerOption, setMarkerOption] = useState('pay')  //pay, counts
  //設定搜尋目標點
  const [target, setTarget] = useState();
  //設定目前點的停車場
  const [currentPark, setCurrentPark] = useState()
  //剩餘車位
  const [remainings, setRemainings] = useState()
  //導航路線
  const [directions, setDirections] = useState();
  
  //設定初始點
  const [mapCenter, setMapCenter] = useState({ lng: 121.46, lat: 25.041 });

  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState();
  const [isFollow, setIsFollow] = useState(true)
  //看是否要啟動cardPanel
  const [isNearActive, setIsNearActive] = useState(false)

  const [inputingVal, setInputingVal] = useState('')
  //設定是否要搜尋路線 的開關
  const [canFetchDirection, setCanFetchDirection] = useState(false)
  const [allParks, setAllParks] = useState()
  const [nearParks, setNearParks] = useState()

  const [isEmptyParkId, setIsEmptyParkId] = useState(false)
  const [filterConditions, setFilterConditions] = useState([])
  const [userFilteredParks, setUserFilteredParks] = useState([])

  const contextValue = {
    nearParks, setNearParks, 
    allParks, setAllParks, 
    mapCenter, setMapCenter, 
    mode, setMode, 
    mapInstance, setMapInstance, 
    target, setTarget, 
    setSpeech, 
    selfPos, setSelfPos, 
    directions, setDirections, 
    transOption, setTransOption,
    mapRef,  
    currentPark, setCurrentPark, 
    canFetchDirection, setCanFetchDirection, 
    remainings, setRemainings, 
    isFollow, setIsFollow, 
    setInputingVal,
    markerOption, setMarkerOption,
    isEmptyParkId, setIsEmptyParkId,
    filterConditions, setFilterConditions,
    userFilteredParks, setUserFilteredParks,
  }


  //一載入就去抓使用者的上次交通工具設定
  useEffect(() => {
    if (!localStorage.getItem('transOption')) return
    setTransOption(localStorage.getItem('transOption'))
  }, [])


  //處理目標的地址，模式變成 target
  let targetAddressRef = useRef(null)
  const getPlaceResult = (placeValue) => {
    targetAddressRef.current = placeValue
    if (!targetAddressRef) return
    navigate(`/map?target=${targetAddressRef.current}`, {push: true})
  }

  //網址改變時
  useEffect(() => {
    //如果id不對就跳警告


    //如果有地址就去搜尋
    // if (!queryParams) return
    if (queryParams.get('target')) {
      setMode('target')
      targetAddressRef.current = queryParams.get('target')
    }
    

  }, [location])


  let detailWindowClass = ''
  if (currentPark) {
    detailWindowClass = 'detail__window active'
  } else {
    detailWindowClass = 'detail__window'
  }

  return (
    <allContext.Provider value={contextValue}>
      
      <div className="map__container">
        {!isLoaded && <div className="map__loading"></div>}
        {isLoaded && <Map />}

        <div className="map__ui">
          <Sidebar />

          <div className="search__controller">
            
            {isLoaded && <Place 
              inputingVal={inputingVal}
              setInputingVal={setInputingVal}
              getPlaceResult={getPlaceResult}
              setMode={setMode}
              speech={speech}
              targetAddressRef={targetAddressRef}
              setTarget={(position) => {
                //輸入 target 後，模式切換成 target
                setMode("target");
                setTarget(position);
                //移動地圖中心至 target
                setMapCenter(position);
              }}
            ></Place>}
            <Speech setSpeech={setSpeech}></Speech>

            <FilterPanel filterConditions={filterConditions} setFilterConditions={setFilterConditions} />
            <MarkerController markerOption={markerOption} setMarkerOption={setMarkerOption}/>
            <TransTypeController transOption={transOption} setTransOption={setTransOption}/>
            <Locate />
          </div>
          <CardPanel 
            isNearActive={isNearActive}
            setIsNearActive={setIsNearActive}
          />
          <SecondsCounter remainings={remainings}/>

          <div className={detailWindowClass}>
            <div className='detail__control'>
              {/* 可以放一排控制鈕 */}
            </div>
            <DetailPanel currentPark={currentPark} setCurrentPark={setCurrentPark}/>
          </div>

          
        </div>
        <Footer setIsNearActive={setIsNearActive} isNearActive={isNearActive} />
        <Warning 
          setIsEmptyParkId={setIsEmptyParkId}
          isEmptyParkId={isEmptyParkId}
          currentPark={currentPark} 
          transOption={transOption}
          target={target}
          setCurrentPark={setCurrentPark}
          mapCenter={mapCenter}/>
      </div>
    </allContext.Provider>
  )
}

