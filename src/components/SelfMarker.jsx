import selfMarker from '../assets/images/marker-self.svg'
import { MarkerF } from '@react-google-maps/api';




export default function SelfMarker ({selfPos}) {
  return (
    <>
      <MarkerF     
        zIndex={999}        
        position={selfPos} 
        animation={window.google.maps.Animation.DROP}
        icon={{
          url: selfMarker,
          scaledSize: { width: 32, height: 32 },
          className: 'marker'
        }}/>
    </>
  )
}
