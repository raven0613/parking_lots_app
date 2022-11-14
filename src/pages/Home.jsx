import React, { useContext, useRef, useState, useEffect } from "react"
import { useLoadScript } from "@react-google-maps/api"
import { useNavigate, useLocation } from 'react-router-dom'
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
import { allContext } from '../utils/Provider'

// const libraries = ["places"]

export default function Home() {

  const { setTransOption } = useContext(allContext)


  //路由相關
  // const navigate = useNavigate()
  // const location = useLocation()
  // const queryParams = new URLSearchParams(location.search)



  // //一載入就去抓使用者的上次交通工具設定
  // useEffect(() => {
  //   if (!localStorage.getItem('transOption')) return
  //   setTransOption(localStorage.getItem('transOption'))
  // }, [])


  // 處理目標的地址，模式變成 target
  // let targetAddressRef = useRef(null)
  // const getPlaceResult = (placeValue) => {
  //   targetAddressRef.current = placeValue
  //   if (!targetAddressRef) return
  //   navigate(`/map?target=${targetAddressRef.current}`, {push: true})
  // }



  // let detailWindowClass = ''
  // if (currentPark) {
  //   detailWindowClass = 'detail__window active'
  // } else {
  //   detailWindowClass = 'detail__window'
  // }

  return (
    <>
    </>
  )
}

