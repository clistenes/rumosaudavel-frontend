'use client'

import Image from 'next/image'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
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
        <DropdownItem className="text-danger py-2" onClick={handleLogout}>
          <IconifyIcon icon="la:power-off" className="fs-18 me-1 align-text-bottom" /> Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
