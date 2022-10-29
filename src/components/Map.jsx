import { useMemo, useCallback, useRef, useState, useEffect } from 'react'
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import Place from './Place';
import ParkingMark from './ParkingMark';

const libraries = ['places']
//取得使用者的 currentPosition
const getUserPos = (setSelfPos) => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if(setSelfPos) {
          setSelfPos(() => {
            console.log('setSelfPos')
            return {lat: position.coords.latitude, lng: position.coords.longitude}
          })
        }
      },
      (error) => {
        console.log(error)
      }
    )
  } else {
    alert('你的裝置不支援地理位置功能。')
  }
}


export default function Map () {
  //使用者的 currentPosition
  const [selfPos, setSelfPos] = useState()

  //一載入就去抓使用者的 currentPosition
  useEffect(() => {
    console.log('on page loaded')
    getUserPos(setSelfPos)
  },[])

  
  
  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries
  })
  //設定搜尋目標點
  const [target, setTarget] = useState()
  const mapRef = useRef()
  //設定初始點
  const center = useMemo(() => (selfPos), [selfPos])
  const options = useMemo(() => ({
      //在google map後台設定，不須保密
      mapId: 'feb728f5023695e4',
      //地圖上的UI不顯示
      disableDefaultUI: true,
      //地圖上的標記不能點
      clickableIcons: false
    }
  ), [])

  //地圖載入後把 map 存進 mapRef ，useCallback: 不要每次重新渲染時都再次渲染
  const onLoad = useCallback((map) => (mapRef.current = map), [])

  if (!isLoaded) return <p>Loading...</p>
  return (
    <>
      <div className='controller'>
        <Place setTarget={(position) => {
          setTarget(position)
          //移動地圖中心至 target
          mapRef.current?.panTo(position)
        }}></Place>
      </div>
      
      <div className="map">
        <GoogleMap 
        zoom={15} 
        center={ center } 
        mapContainerClassName="map"
        options={options}
        onLoad={onLoad}
        >
          
          {selfPos && <MarkerF position={selfPos} className="self-point marker"/> }

          {target && <MarkerF position={target}/>}
          <ParkingMark target={target} selfPos={selfPos} />
        </GoogleMap>
      </div>
    </>
  )
}