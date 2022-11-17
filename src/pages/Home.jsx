import React, { useContext, useRef, useState, useEffect } from "react"
import Map from "../components/Map";
import Place from "../components/Place";
import CardPanel from '../components/card-panel/CardPanel'
import TransTypeController from '../components/TransTypeController'
import MarkerController from '../components/MarkerController'
import DetailPanel from '../components/DetailPanel'
import SecondsCounter from '../components/SecondsCounter'
import Locate from '../components/Locate'
import FilterPanel from '../components/FilterPanel'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Warning from '../components/Warning'
import ThemeButton from '../components/ThemeButton'


import { useSelector } from 'react-redux'
import { } from '../reducer/reducer'


export default function Home({isGoogleApiLoaded, setIsGoogleApiLoaded}) {
  const currentPark = useSelector((state) => state.park.currentPark)


  return (
    <>
      <div className="map__container">
        {!isGoogleApiLoaded && <div className="map__loading"></div>}
        <Map setIsGoogleApiLoaded={setIsGoogleApiLoaded}/>

        <div className="map__ui">
          <Sidebar />

          <div className="search__controller">
            
            {isGoogleApiLoaded && <Place />}

            <FilterPanel />
            <MarkerController />
            <TransTypeController />
            <Locate />
            <ThemeButton />
          </div>
          
          <CardPanel />
          <SecondsCounter />

          <div className={currentPark?.id? 'detail__window active' : 'detail__window'}>
            <div className='detail__control'>
              {/* 可以放一排控制鈕 */}
            </div>
            <DetailPanel />
          </div>
        </div>
        <Footer />
        <Warning />
      </div>
    </>
  )
}

