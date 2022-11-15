import React, { useState } from "react";



import Home from '../pages/Home'

export const allContext = React.createContext('')


export default function Provider () {

  //因為 redux不接受 unserialized object 所以用 hook state 存
  const [mapInstance, setMapInstance] = useState()
  //導航路線
  const [directions, setDirections] = useState()

  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false)
  
  
  const contextValue = {
    mapInstance, setMapInstance, 
    directions, setDirections,
  }

  return (
    <allContext.Provider value={contextValue}>
      <Home isGoogleApiLoaded={isGoogleApiLoaded} setIsGoogleApiLoaded={setIsGoogleApiLoaded}/>
    </allContext.Provider>
  )
}

