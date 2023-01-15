import { Marker } from '@react-google-maps/api';


export default function ParkingMark ({ nearParksWithOutCurrent, label, icon, directions, currentPark, transOption, markerOption, onMarkerToggled }) {
  
  return (
    <>
      {currentPark?.id && 
        <Marker 
        position={{lng: currentPark.lng, lat: currentPark.lat}} 
        icon={icon(transOption, currentPark, true)}
        label={label(markerOption, transOption, currentPark, true)}
        zIndex={2}
        key={currentPark.id} 
      />
     }

      {!directions && nearParksWithOutCurrent && nearParksWithOutCurrent.map(park => {
        const positon = {lng: park.lng, lat: park.lat}
        return (
          <Marker 
            icon={icon(transOption, park, false)}
            label={label(markerOption, transOption, park, false)}
            zIndex={1}
            className="marker"
            position={positon} 
            key={park.id} 
            onClick={(e) => {
              e.domEvent.preventDefault()
              e.domEvent.stopPropagation()
              onMarkerToggled(park)
            }} />
        )
      })}
    </>
  )
}

