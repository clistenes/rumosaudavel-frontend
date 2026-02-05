import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ResetPasswordForm from './components/ResetPasswordForm'

import logoDarkImg from '@/assets/images/logo-light.png'
import { Card, CardBody, Col } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Esqueci Minha Senha' }

const ResetPassword = () => {
  return (
    <Col lg={4} className="mx-auto">
      <Card>
        <CardBody className="p-0 bg-gray-100 auth-header-box rounded-top">
          <div className="text-center p-4">
            <Link href="/" className="logo logo-admin">
              <Image src={logoDarkImg} height={50} alt="logo" className="auth-logo" />
            </Link>
            <h4 className="mt-4 mb-1 fw-semibold fs-18">Recuperar Senha</h4>
            <p className="text-muted mb-0">Digite seu email para receber as instruções</p>
          </div>
        </CardBody>
        <CardBody>
          <ResetPasswordForm />

          <div className="text-center mb-2">
            <p className="text-muted">
              Lembrou a senha?{' '}
              <Link href="/auth/login" className="text-primary ms-2">
                Faça login aqui
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

export default ResetPassword
