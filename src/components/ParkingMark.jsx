import { Marker } from '@react-google-maps/api';

import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as ParkMarker } from '../assets/images/marker-parking.svg'

import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPark } from '../reducer/reducer'


export default function ParkingMark ({ nearParksWithOutCurrent, label, icon, availableCounts }) {
  const currentPark = useSelector((state) => state.park.currentPark)
  const transOption = useSelector((state) => state.park.transOption)
  const dispatch = useDispatch()
  //路由相關
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {/* <ParkMarker className="marker__current" alt="logo" stroke="#DB7290" /> */}
      {currentPark?.id && 
        <Marker 
        position={{lng: currentPark.lng, lat: currentPark.lat}} 
        icon={icon(transOption, currentPark, true)}
        label={label(transOption, currentPark, true)}
        zIndex={2}
        key={currentPark.id} 
      />
     }

      {nearParksWithOutCurrent && nearParksWithOutCurrent.map(park => {
        const positon = {lng: park.lng, lat: park.lat}
        // 切換這邊就可以切換要不要顯示0
        // if (availableCounts(transOption, park) < 1) return <p key={park.id}></p>
        return (
          <Marker 
            icon={icon(transOption, park, false)}
            label={label(transOption, park, false)}
            zIndex={1}
            className="marker"
            position={positon} 
            key={park.id} 
            onClick={() => {
              const queryStr = location.search
              dispatch(setCurrentPark(park))
              navigate(`/map/${park.id}${queryStr}`, {push: true})
            }} />
        )
      })}
    </>
  )
}

