import logo from '../assets/images/logo.svg'
import name from '../assets/images/name.svg'
import Locate from './Locate'
import TransTypeController from './TransTypeController'
import MarkerController from './MarkerController'


export default function Sidebar () {


  return (
    <>
      <div className="sidebar">
        <div className="sidebar__logo"><img src={logo} alt="logo" /><img src={name} alt="name" /></div>
        <MarkerController />
        <TransTypeController />
        <Locate />
        {/* <button onClick={() => {
          if (mapId === darkMap) return setMapId(lightMap)
          if (mapId === lightMap) return setMapId(darkMap)
        }}>按紐</button> */}
      </div>
    </>
  )
}