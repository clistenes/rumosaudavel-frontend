'use client'

import Image from 'next/image'
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { signOut } from 'next-auth/react'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const ProfileDropdown = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' })
  }
  return (
    <Dropdown as={'li'} className="topbar-item">
      <DropdownToggle as={'a'} className="nav-link arrow-none nav-icon" role="button" aria-haspopup="false" aria-expanded="false">
        <Image width={36} height={36} src={avatar1} alt="user" className="thumb-md rounded-circle" />
      </DropdownToggle>
      <DropdownMenu align={'end'} className="py-0 mt-3">
        <div className="d-flex align-items-center dropdown-item py-2 bg-secondary-subtle">
          <div className="flex-shrink-0">
            <Image src={avatar1} alt="avatar" className="thumb-md rounded-circle" />
          </div>
          <div className="flex-grow-1 ms-2 text-truncate align-self-center">
            <h6 className="my-0 fw-medium text-dark fs-13">William Martin</h6>
            <small className="text-muted mb-0">Front End Developer</small>
          </div>
        </div>
        <DropdownDivider className="mt-0" />
        <small className="text-muted px-2 pb-1 d-block">Account</small>
        <DropdownItem href="/pages/profile">
          <IconifyIcon icon="la:user" className="fs-18 me-1 align-text-bottom" /> Profile
        </DropdownItem>
        <DropdownItem href="/pages/faqs">
          <IconifyIcon icon="la:wallet" className="fs-18 me-1 align-text-bottom" /> Earning
        </DropdownItem>
        <small className="text-muted px-2 py-1 d-block">Settings</small>
        <DropdownItem href="/pages/profile">
          <IconifyIcon icon="la:cog" className="fs-18 me-1 align-text-bottom" />
          Account Settings
        </DropdownItem>
        <DropdownItem href="/pages/profile">
          <IconifyIcon icon="la:lock" className="fs-18 me-1 align-text-bottom" /> Security
        </DropdownItem>
        <DropdownItem href="/pages/faqs">
          <IconifyIcon icon="la:question-circle" className="fs-18 me-1 align-text-bottom" /> Help Center
        </DropdownItem>
        <DropdownDivider className="mb-0" />
        <DropdownItem className="text-danger" onClick={handleLogout}>
          <IconifyIcon icon="la:power-off" className="fs-18 me-1 align-text-bottom" /> Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
