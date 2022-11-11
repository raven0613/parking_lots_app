import logo from '../assets/images/logo.svg'
import word from '../assets/images/404word.svg'
import image from '../assets/images/404image.svg'
import back from '../assets/images/404back.svg'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

export default function NotFound () {
  return (
    <>
      <div className="not-found">
        <Sidebar />
        <div className="not-found__container">
          <img className="not-found__img" src={image} alt="404image"></img>
          <p className="not-found__title">404</p>
          <img className="not-found__subtitle" src={word} alt="404word"></img>
          {/* <p className="not-found__subtitle">頁面不見囉</p> */}
          <Link className='not-found__btn' to='/'>
            <img src={back} alt="404back"></img>
          </Link>

        </div>

      </div>
    </>
  )
}