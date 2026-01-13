import React from 'react'

import LeftSideBar from './LeftSideBar'
import TopBar from './TopBar'
import Footer from './Footer'

type Props = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="admin-wrapper">
      <TopBar />

      <div className="d-flex">
        <LeftSideBar />

        <main className="content-page flex-grow-1">
          <div className="content">
            {children}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}
