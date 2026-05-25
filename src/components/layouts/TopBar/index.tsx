import React from 'react'
import Language from './components/Language'
import ThemeToggle from './components/ThemeToggle'
import Notification from './components/Notification'
import LeftSideBarToggle from './components/LeftSideBarToggle'

const TopBar = () => {
  return (
    <div className="topbar d-print-none">
      <div className="container-fluid">
        <nav className="topbar-custom d-flex justify-content-between" id="topbar-custom">
          <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
            <LeftSideBarToggle />
            <li className="mx-2 welcome-text">

            </li>
          </ul>
          <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
          
          
            <ThemeToggle />
            {/* <Notification /> */}
          </ul>
        </nav>
      </div>
    </div>


  )
}

export default TopBar
