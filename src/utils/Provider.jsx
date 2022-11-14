import React, { useEffect, useRef, useState } from "react";
import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

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
import Home from '../pages/Home'

export const allContext = React.createContext('')




export default function Provider () {
  
  //因為 redux不接受 unserialized object 所以用 hook state 存
  const [mapInstance, setMapInstance] = useState()
  //導航路線
  const [directions, setDirections] = useState()


  const [isFollow, setIsFollow] = useState(true)
  //看是否要啟動cardPanel
  const [isNearActive, setIsNearActive] = useState(false)


  const [isEmptyParkId, setIsEmptyParkId] = useState(false)
  const [filterConditions, setFilterConditions] = useState([])
  
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false)
  

  const contextValue = {
    mapInstance, setMapInstance, 
    directions, setDirections,
    isFollow, setIsFollow,
    isEmptyParkId, setIsEmptyParkId,
    filterConditions, setFilterConditions,
    isNearActive, setIsNearActive,
    isGoogleApiLoaded, setIsGoogleApiLoaded
  }
  const currentPark2 = useSelector((state) => state.park.currentPark)
  return (
    <allContext.Provider value={contextValue}>
      <Home />

        <div className="map__container">
          {/* {!isLoaded && <div className="map__loading"></div>} */}
          <Map />

          <div className="map__ui">
            <Sidebar />

            <div className="search__controller">
              
              {isGoogleApiLoaded && <Place />}

              <FilterPanel />
              <MarkerController />
              <TransTypeController />
              <Locate />
            </div>
            
            <CardPanel />
            <SecondsCounter />

            <div className={currentPark2?.id? 'detail__window active' : 'detail__window'}>
              <div className='detail__control'>
                {/* 可以放一排控制鈕 */}
              </div>
              <DetailPanel />
            </div>
          </div>
          <Footer />
          <Warning />
        </div>

      
    </allContext.Provider>
  )
}

