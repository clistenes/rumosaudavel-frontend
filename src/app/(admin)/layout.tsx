import Footer from '@/components/layouts/Footer'
import LeftSideBar from '@/components/layouts/LeftSideBar'
import TopBar from '@/components/layouts/TopBar'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { ChildrenType } from '@/types/component-props'
import React from 'react'
import { Container } from 'react-bootstrap'

const layout = ({ children }: ChildrenType) => {
  return (
    <RoleGuard allowedTypes={[1]}>
      <TopBar />
      <LeftSideBar />
      <div className="startbar-overlay d-print-none" />
      <div className="page-wrapper">
        <div className="page-content">
          <Container fluid>
            {children}
          </Container>
          <Footer />
        </div>
      </div>
    </RoleGuard>
  )
}

export default layout
