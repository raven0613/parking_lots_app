import React, { useState } from "react";
import ParkDataManager from '../components/ParkMarkerController'


import Home from '../pages/Home'

export const mapContext = React.createContext('')
export const parkContext = React.createContext('')

export default function Provider () {

  //因為 redux 不接受 unserialized object 所以用 hook state 存
  const [mapInstance, setMapInstance] = useState()
  //導航路線
  const [directions, setDirections] = useState()

  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false)


  const [nearParksWithOutCurrent, setNearParksWithOutCurrent] = useState()
  const [parkIcon, setParkIcon] = useState()
  const [parkLabel, setParkLabel] = useState()
  const [onParkMarkClicked, setOnParkMarkClicked] = useState(false, {})

  
  const mapUIcontextValue = {
    mapInstance, setMapInstance, 
    directions, setDirections
  }
  const parkUIContextValue = {
    nearParksWithOutCurrent, setNearParksWithOutCurrent,
    parkIcon, setParkIcon,
    parkLabel, setParkLabel,
    onParkMarkClicked, setOnParkMarkClicked
  }

  return (
    <mapContext.Provider value={mapUIcontextValue}>
      <parkContext.Provider value={parkUIContextValue}>
        <Home isGoogleApiLoaded={isGoogleApiLoaded} setIsGoogleApiLoaded={setIsGoogleApiLoaded}/>
      </parkContext.Provider>
    </mapContext.Provider>
  )
}

