import axios from 'axios'

export function getParkingLots () {
  return axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json')
}

export function getRemaining () {
  return axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_allavailable.json')
}