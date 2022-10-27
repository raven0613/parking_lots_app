import { useMemo, useCallback, useRef } from 'react'
import { useJsApiLoader, GoogleMap,  } from '@react-google-maps/api';
import { coordinatesConvert } from '../utils/helpers'

// const LatLngBounds = google.maps.LatLngBounds

export default function Map () {
  const coo = coordinatesConvert(306812.928, 2769892.95)
  console.log(coo.lng)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  })
  const mapRef = useRef()
  //設定初始點
  const center = useMemo(() => ({lat: 25.040979, lng: 121.4570441}), [])
  const options = useMemo(() => ({
      //在google map後台設定，不須保密
      mapId: 'feb728f5023695e4',
      //一些地圖上的東西不顯示
      disableDefaultUI: true,
      clickableIcons: false
    }
  ), [])
  //不要每次重新渲染時都再次渲染
  const onLoad = useCallback((map) => (mapRef.current === map), [])

  
  if (!isLoaded) return <p>Loading...</p>
  return (
    <div className="map">
      <GoogleMap 
      zoom={15} 
      center={ center } 
      mapContainerClassName="map"
      options={options}
      onLoad={onLoad}
      ></GoogleMap>
    </div>
  )
}