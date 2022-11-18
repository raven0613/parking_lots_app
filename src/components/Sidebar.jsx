import logo from '../assets/images/logo.svg'
import name from '../assets/images/name.svg'
import Locate from './controllers/Locate'
import ThemeButton from './controllers/ThemeButton'
import TransTypeController from './controllers/TransTypeController'
import MarkerController from './controllers/MarkerController'

export default function Sidebar () {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar__logo"><img src={logo} alt="logo" /><img src={name} alt="name" /></div>
        <MarkerController />
        <TransTypeController />
        <Locate />
        <ThemeButton />
      </div>
    </>
  )
}