import axios from 'axios'

export function getParkingLots () {
  return axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json')
}

export function getRemaining () {
  return axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_allavailable.json')
}

export function getWeather () {
  return axios.get('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-061?Authorization=CWB-9B7FC138-F11C-4139-913B-6BA440C4591A&format=JSON&elementName=Wx')
}
