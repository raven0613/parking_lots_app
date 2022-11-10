import logo from '../assets/images/logo.svg'
import name from '../assets/images/name.svg'
import Locate from './Locate'
import TransTypeController from './TransTypeController'
import MarkerController from './MarkerController'
import { useContext } from 'react'
import { allContext } from '../pages/Home'

export default function Sidebar () {
  const { markerOption, transOption, setMarkerOption, setTransOption} = useContext(allContext)

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__logo"><img src={logo} alt="logo" /><img src={name} alt="name" /></div>
        <MarkerController markerOption={markerOption} setMarkerOption={setMarkerOption}/>
        <TransTypeController transOption={transOption} setTransOption={setTransOption}/>
        <Locate />
        {/* <button onClick={() => {
          if (mapId === darkMap) return setMapId(lightMap)
          if (mapId === lightMap) return setMapId(darkMap)
        }}>按紐</button> */}
      </div>
    </>
  )
}