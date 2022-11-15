import { configureStore } from '@reduxjs/toolkit'
import { parkReducer, mapReducer } from '../reducer/reducer'

export const store = configureStore({
  reducer: { 
    park: parkReducer,
    map: mapReducer
   }
})