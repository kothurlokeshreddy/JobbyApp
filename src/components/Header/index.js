import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {MdHome} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header">
      <div className="logo-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
      </div>
      <ul className="nav-mobile-links-container">
        <Link to="/">
          <li>
            <MdHome color="#ffffff" className="nav-icons" />
          </li>
        </Link>
        <Link to="/jobs">
          <li>
            <BsBriefcaseFill color="#ffffff" className="nav-icons" />
          </li>
        </Link>
        <li>
          <FiLogOut
            color="#ffffff"
            className="nav-icons"
            onClick={onClickLogout}
          />
        </li>
      </ul>
      <ul className="nav-links-container">
        <div>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/jobs">
            <li>Jobs</li>
          </Link>
        </div>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
