import axios from 'axios'

export function getParkingLots () {
  return axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json')
}

export function getRemaining () {
  return axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_allavailable.json')
}

export function getWeather () {
  return axios.get('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-061?Authorization=CWB-545FAA0B-4659-45E5-9F35-81250F359B49&format=JSON&elementName=Wx')
}
