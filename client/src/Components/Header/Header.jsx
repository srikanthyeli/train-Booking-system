import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import './Header.css'

const Header = props => {
  const navigateTo=useNavigate()
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigateTo("/login")
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-large-container">
        <Link to="/">
            <img
              className="website-logo"
              src="https://img.freepik.com/premium-vector/train-logo-concept-icon-illustration_683738-2658.jpg"
              alt="website logo"
            />
          </Link>
          <h1 className="heading-2">Train Reservation</h1>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
     
    </nav>
  )
}

export default Header