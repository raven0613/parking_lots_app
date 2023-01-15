import React, { useContext, useRef, useState, useEffect } from "react"
import Map from "../components/Map";
import Place from "../components/Place";
import CardPanel from '../components/card-panel/CardPanel'
import TransTypeController from '../components/controllers/TransTypeController'
import MarkerController from '../components/controllers/MarkerController'
import DetailPanel from '../components/DetailPanel'
import SecondsCounter from '../components/SecondsCounter'
import Locate from '../components/controllers/Locate'
import FilterPanelController from '../components/controllers/FilterPanelController'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Warning from '../components/Warning'
import ThemeButton from '../components/controllers/ThemeButton'

import { getParkingLots, getRemaining, getWeather } from '../apis/places'
import { coordinatesConvert, payexFilter, formattedParksData, serviceTimeFilter, weatherDataFomatter } from '../utils/parkHelpers'
import { useFetchData } from '../components/useFetchData'
import { useSelector, useDispatch } from 'react-redux'
import { setRemainings } from '../reducer/reducer'



//初次合併完成的所有資料
const combinedInitAllParksData = (parks) => {
  const formattedParks = formattedParksData(parks, coordinatesConvert)
  const formattedParksWithPay = payexFilter(formattedParks)
  const formattedParksWithService = serviceTimeFilter(formattedParksWithPay)
  return formattedParksWithService
}

const FETCH_INRERVAL_PARKS = 43200000
const FETCH_INRERVAL_REMAININGS = 20000
const FETCH_INRERVAL_WEATHER = 600000

export default function Home({isGoogleApiLoaded, setIsGoogleApiLoaded}) {
  const currentPark = useSelector((state) => state.park.currentPark)

  const dispatch = useDispatch()
  const [allParks, setAllParks] = useState()
  const [weather, setWeather] = useState()

  //抓取所有停車場資料
  const {data: parksRes, isFetching: parksIsFetching, error: parksError } = useFetchData(getParkingLots, FETCH_INRERVAL_PARKS) || null
  const parksData = parksRes?.data.data.park || null
  //抓取所有剩餘停車場資料
  const {data: remainingsRes, isFetching: remainingsIsFetching, error: remainingsError } = useFetchData(getRemaining, FETCH_INRERVAL_REMAININGS) || null
  const remainingsData = remainingsRes?.data.data.park || null
  //抓取所有天氣資料
  const {data: weatherRes, isFetching: weatherIsFetching, error: weatherError } = useFetchData(getWeather, FETCH_INRERVAL_WEATHER) || null
  const weatherData = weatherRes?.data.records.locations[0].location || null

  useEffect(() => {
    if (parksIsFetching) return
    if (!parksData) return
    if (parksError) return
    const parks = combinedInitAllParksData(parksData)
    setAllParks(parks)
  }, [parksIsFetching, parksData, parksError])

  useEffect(() => {
    if (remainingsIsFetching) return
    if (!remainingsData) return
    if (remainingsError) return
    dispatch(setRemainings(remainingsData))
  }, [remainingsIsFetching, remainingsData, remainingsError, dispatch])

  useEffect(() => {
    if (weatherIsFetching) return
    if (!weatherData) return
    if (weatherError) return
    const convertedWeatherData = weatherDataFomatter(weatherData)
    setWeather(convertedWeatherData)
  }, [weatherIsFetching, weatherData, weatherError])


  return (
    <>
      <div className="map__container">
        {!isGoogleApiLoaded && <div className="map__loading"></div>}
        <Map setIsGoogleApiLoaded={setIsGoogleApiLoaded} allParks={allParks} weather={weather}/>

        <div className="map__ui">
          <Sidebar />

          <div className="search__controller">
            
            {isGoogleApiLoaded && <Place />}

            <FilterPanelController />
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

