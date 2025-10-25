import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logoSm from '@/assets/images/logo-sm.png'
import logoLight from '@/assets/images/logo-light.png'
import logoDark from '@/assets/images/logo-dark.png'

const LogoBox = () => {
  return (
    <Link href="/" className="logo">
      <span>
        <Image src={logoSm} width={24} height={24} alt="logo-small" className="logo-sm" />
      </span>
      <span >
        <Image src={logoLight} alt="logo-large" height={22} className="logo-lg logo-light" />
        <Image src={logoDark} alt="logo-large" height={22} className="logo-lg logo-dark" />
      </span>
    </Link>
  )
}

export default LogoBox