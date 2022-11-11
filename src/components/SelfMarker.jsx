import selfMarker from '../assets/images/marker-self.svg'
import { Marker } from '@react-google-maps/api';
import { useEffect } from 'react';




export default function SelfMarker ({selfPos}) {

  useEffect(() => {
    
  }, [selfPos])

  return (
    <>
      <Marker             
        position={selfPos} 
        className="self-point marker" 
        animation={window.google.maps.Animation.DROP}
        icon={{
          url: selfMarker,
          scaledSize: { width: 32, height: 32 },
          className: 'marker'
        }}/>
    </>
  )
}
