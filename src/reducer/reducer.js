import { createSlice } from '@reduxjs/toolkit'


export const parkSlice = createSlice({
  name: 'park',
  initialState: { 
    transOption: 'car',
    markerOption: 'pay',
    isShowZero: true,
    filterConditions: [], 
    currentPark: {},
    nearParks: [],
    remainings: [],
    isEmptyId: false
  },
  reducers: {
    setTransOption: (state, action) => {
      state.transOption = action.payload //self, target, screen-center
    },
    setMarkerOption: (state, action) => {
      state.markerOption = action.payload //pay, counts
    },
    setIsShowZero: (state, action) => {
      state.isShowZero = action.payload
    },
    setFilterConditions: (state, action) => {
      state.filterConditions = [ ...action.payload ] //disabled, pregnancy, charging
    },
    setCurrentPark: (state, action) => {
      state.currentPark = { ...action.payload }
    },
    setNearParks: (state, action) => {
      state.nearParks = [ ...action.payload ]
    },
    setRemainings: (state, action) => {
      state.remainings = [ ...action.payload ]
    },
    //網址上的id是否為空
    setIsEmptyId: (state, action) => {
      state.isEmptyId = action.payload //pay, counts
    },
  }
})

export const { setTransOption, setMarkerOption, setIsShowZero, setFilterConditions, setCurrentPark, setNearParks, setRemainings, setIsEmptyId } = parkSlice.actions
export const parkReducer = parkSlice.reducer



export const mapSlice = createSlice({
  name: 'map',
  initialState: { 
    isLocateDenied: false,
    mode: 'self',
    selfPos: '',
    mapCenter: { lng: 121.51763286051023, lat: 25.04194409222794 },
    target: { lat: '', lng: '' },
    canFetchDirection: false,
    isFollow: true
   },
  reducers: {
    setIsLocateDenied: (state, action) => {
      state.isLocateDenied = action.payload
    },
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
      state.canFetchDirection = action.payload
    },
    //要不要跟隨user位置
    setIsFollow: (state, action) => {
      state.isFollow = action.payload
    },
  }
})

export const { setIsLocateDenied, setMode, setSelfPos, setMapCenter, setTarget, setCanFetchDirection, setIsFollow } = mapSlice.actions
export const mapReducer = mapSlice.reducer



export const UISlice = createSlice({
  name: 'UI',
  initialState: { 
    warningMsg: ''
  },
  reducers: {
    setWarningMsg: (state, action) => {
      state.warningMsg = action.payload
    },
  }
})

export const { setWarningMsg } = UISlice.actions
export const UIReducer = UISlice.reducer