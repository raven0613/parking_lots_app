import { useMemo, useCallback, useRef, useState } from 'react'
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import SelfMark from './SelfMark';
import Place from './Place';
// import { coordinatesConvert } from '../utils/helpers'


export default function Map () {

  // //轉換座標
  // const coo = coordinatesConvert(306812.928, 2769892.95)
  // console.log(coo.lng)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  })
  
  const [target, setTarget] = useState({lat: 25.0117, lng: 121.4658})
  const mapRef = useRef()
  //設定初始點
  const center = useMemo(() => ({lat: 25.0117, lng: 121.4658}), [])
  const options = useMemo(() => ({
      //在google map後台設定，不須保密
      mapId: 'feb728f5023695e4',
      //地圖上的UI不顯示
      disableDefaultUI: true,
      //地圖上的標記不能點
      clickableIcons: true
    }
  ), [])
  //不要每次重新渲染時都再次渲染
  const onLoad = useCallback((map) => (mapRef.current === map), [])

  if (!isLoaded) return <p>Loading...</p>
  return (
    <>
      <div className='controller'>
        <Place setTarget={(position) => {
          setTarget(position)
          //移動地圖至該處
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
          {/* <MarkerF className="marker" position={center}/> */}
          <SelfMark />
          {target && <MarkerF position={target}/>}
        </GoogleMap>
      </div>
    </>
  )
}