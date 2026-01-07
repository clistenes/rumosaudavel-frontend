import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from './components/LoginForm'

import logoDarkImg from '@/assets/images/logo-light.png'
import { Card, CardBody, Col } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Login' }

const Login = () => {
  return (
    <Col lg={4} className="mx-auto">
      <Card>
        <CardBody className="p-0 bg-gray-100 auth-header-box rounded-top">
          <div className="text-center p-4">
            <Link href="/" className="logo logo-admin">
              <Image src={logoDarkImg} height={50} alt="logo" className="auth-logo" />
            </Link>
            <h4 className="mt-4 mb-1 fw-semibold  fs-18">Bem vindo ao Portal da Rumo!</h4>
          </div>
        </CardBody>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
    </Col>
  )
}

export default Login
