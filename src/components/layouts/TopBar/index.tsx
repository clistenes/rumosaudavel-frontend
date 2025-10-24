import React from 'react'
import Language from './components/Language'
import ThemeToggle from './components/ThemeToggle'
import Notification from './components/Notification'
import ProfileDropdown from './components/ProfileDropdown'
import LeftSideBarToggle from './components/LeftSideBarToggle'

const TopBar = () => {
  return (
    <div className="topbar d-print-none">
      <div className="container-fluid">
        <nav className="topbar-custom d-flex justify-content-between" id="topbar-custom">
          <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
            <LeftSideBarToggle />
            <li className="mx-2 welcome-text">
              <a className=" btn btn-sm text-primary btn-soft-primary" href="#" role="button"><i className="fas fa-plus me-2" />New Task</a>
            </li>
          </ul>
          <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
            <li className="hide-phone app-search">
              <form role="search" action="#" method="get">
                <input type="search" name="search" className="form-control top-search mb-0" placeholder="Search here..." />
                <button type="submit"><i className="iconoir-search" /></button>
              </form>
            </li>
            <Language />
            <ThemeToggle />
            <Notification />
            <ProfileDropdown />
          </ul>
        </nav>
      </div>
    </div>


  )
}

export default TopBar