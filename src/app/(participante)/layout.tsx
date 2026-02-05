import Footer from '@/components/layouts/Footer'
import LeftSideBar from '@/components/layouts/LeftSideBar'
import TopBar from '@/components/layouts/TopBar'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { Metadata } from 'next'
import { Container } from 'react-bootstrap'

export const metadata: Metadata = {
  title: 'Participante - Rumo Saudável',
}

export default function ParticipanteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedTypes={[2]}>
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
