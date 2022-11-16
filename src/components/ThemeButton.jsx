import sun from '../assets/images/sun.svg'
import moon from '../assets/images/moon.svg'

import { useSelector, useDispatch } from 'react-redux'
import { setMapStyleChange, setTheme } from '../reducer/reducer'


export default function ThemeButton () {
  const mapStyleChange = useSelector((state) => state.map.mapStyleChange)
  const theme = useSelector((state) => state.UI.theme)
  const dispatch = useDispatch()

  const handleChangeMapStyle = () => {
    if (mapStyleChange === 'light') {
      dispatch(setMapStyleChange('dark'))
      return
    }
    dispatch(setMapStyleChange('light'))
  }
  const handleChangeThemeColor = () => {
    if (theme === 'light') {
      dispatch(setTheme('dark'))
      return
    } 
    dispatch(setTheme('light'))
  }
  const className = () => {
    if (theme === 'light') {
      return 'theme'
    }
    if (theme === 'dark') {
      return 'theme dark'
    }
  }
  const buttonIcon = () => {
    if (theme === 'light') {
      return (
        <img src={moon} alt='light'></img>
      )
    }
    if (theme === 'dark') {
      return (
        <img src={sun} alt='dark'></img>
      )
    }
  }
  return (
    <button 
      className={className()}
      onClick={() => {
        handleChangeMapStyle()
        handleChangeThemeColor()
    }}>{buttonIcon()}</button>
  )
}