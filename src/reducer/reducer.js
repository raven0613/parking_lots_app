import { createSlice } from '@reduxjs/toolkit'

//現在點選的停車場
export const parkSlice = createSlice({
  name: 'park',
  initialState: { 
    transOption: 'car',
    markerOption: 'pay',
    currentPark: {},
    nearParks: [],
    remainings: []
  },
  reducers: {
    setTransOption: (state, action) => {
      state.transOption = action.payload //self, target, screen-center
    },
    setMarkerOption: (state, action) => {
      state.markerOption = action.payload //pay, counts
    },
    setCurrentPark: (state, action) => {
      state.currentPark = { ...action.payload }
    },
    setNearParks: (state, action) => {
      state.nearParks = [ ...action.payload ]
    },
    setRemainings: (state, action) => {
      state.remainings = [ ...action.payload ]
    }
  }
})

export const { setTransOption, setMarkerOption, setCurrentPark, setNearParks, setRemainings } = parkSlice.actions
export const parkReducer = parkSlice.reducer





//現在點選的停車場
export const mapSlice = createSlice({
  name: 'map',
  initialState: { 
    mode: 'self',
    selfPos: { lat: '', lng: '' },
    mapCenter: { lng: 121.51763286051023, lat: 25.04194409222794 },
    target: { lat: '', lng: '' },
    canFetchDirection: false
   },
  reducers: {
    //決定地圖中心在哪裡：self, target, screen-center
    setMode: (state, action) => {
      state.mode = action.payload
    },
    setSelfPos: (state, action) => {
      state.selfPos = { ...action.payload }
    },
    setMapCenter: (state, action) => {
      state.mapCenter = { ...action.payload }
    },
    setTarget: (state, action) => {
      state.target = { ...action.payload }
    },
    setCanFetchDirection: (state, action) => {
      state.canFetchDirection = action
    },
  }
})

export const { setMode, setSelfPos, setMapCenter, setTarget, setCanFetchDirection } = mapSlice.actions
export const mapReducer = mapSlice.reducer