import React, {useContext} from 'react'
import './NavBar.css'

import  {NavLink} from 'react-router-dom';
import AuthContext from '../../contexts/auth-context';

const NavBar = () => {
  const authContext = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <h1>TubesAreYours</h1>
      </div>
      <nav className="navbar__items">
        <ul>
          {authContext.token ? (<li><button onClick={authContext.logout}>Logout</button></li>) : (<li><NavLink to="/login">Login</NavLink></li>)}
        </ul>
      </nav>
    </header>
  )
}

export default NavBar;