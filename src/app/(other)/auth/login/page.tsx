import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from './components/LoginForm'

import logoDarkImg from '@/assets/images/logo-light.png'
import { Card, CardBody, Col } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Login' }

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

const Login = () => {
  return (
    <Col lg={4} className="mx-auto">
      <Card>
        <CardBody className="p-0 bg-gray-100 auth-header-box rounded-top">
          <div className="text-center p-4">
            <Link href="/" className="logo logo-admin">
              <Image src={logoDarkImg} height={50} alt="logo" className="auth-logo" />
            </Link>
            <h4 className="mt-4 mb-1 fw-semibold fs-18">Bem vindo ao Portal da Rumo!</h4>
          </div>
        </CardBody>
        <CardBody>
          {isDemoMode && (
            <div className="alert alert-info mb-3">
              <h6 className="alert-heading fs-6">Modo Demo Ativado</h6>
              <p className="mb-1 small">Use uma das contas de teste:</p>
              <ul className="mb-0 small">
                <li><strong>Admin:</strong> admin / admin123</li>
                <li><strong>Participante:</strong> participante / participante123</li>
                <li><strong>Empresa:</strong> empresa / empresa123</li>
              </ul>
            </div>
          )}
          <LoginForm />
        </CardBody>
      </Card>
    </Col>
  )
}

export default Login
