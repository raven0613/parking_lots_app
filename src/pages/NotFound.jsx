import logo from '../assets/images/logo.svg'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

export default function NotFound () {
  return (
    <>
      <div className="not-found">
        <Sidebar />
        <div className="not-found__container">
          <p className="not-found__title">404</p>
          <p className="not-found__subtitle">Not Found</p>
          <Link className='not-found__btn' to='/'>
            ← 回到首頁
          </Link>
        </div>

      </div>
    </>
  )
}