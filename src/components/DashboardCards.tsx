'use client'
import React from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

export interface DashboardCardProps {
  title: string
  value: string | number
  icon: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'blue' | 'pink' | 'purple'
  onClick?: () => void
  className?: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  variant = 'primary',
  onClick,
  className = ''
}) => {
  return (
    <Col md={6} lg={3} className={className}>
      <Card 
        className={`report-card ${onClick ? 'cursor-pointer' : ''}`} 
        onClick={onClick}
        style={onClick ? { cursor: 'pointer' } : undefined}
      >
        <CardBody>
          <Row className="d-flex justify-content-center">
            <Col>
              <p className="text-dark mb-0 fw-semibold">{title}</p>
              <h3 className="my-2 fs-20">{value}</h3>
            </Col>
            <Col xs={'auto'} className="align-self-center">
              <div className={`flex-shrink-0 text-${variant} thumb-md rounded-circle`}>
                <IconifyIcon icon={icon} className="fs-3" />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

export interface DashboardCardsProps {
  cards: DashboardCardProps[]
  showManualCard?: boolean
  manualCardOnClick?: () => void
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  cards, 
  showManualCard = false,
  manualCardOnClick
}) => {
  return (
    <Row className="justify-content-center">
      {cards.map((card, idx) => (
        <DashboardCard key={idx} {...card} />
      ))}
      
      {showManualCard && (
        <DashboardCard
          title="Manual de Uso"
          value="como usar?"
          icon="iconoir:play"
          variant="blue"
          onClick={manualCardOnClick}
        />
      )}
    </Row>
  )
}

export { DashboardCard }
export default DashboardCards
