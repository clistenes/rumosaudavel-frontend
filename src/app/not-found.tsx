import Image from 'next/image'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import logoSm from '@/assets/images/logo-sm.png'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const NotFound = () => {
  return (
    <div className="container-xxl">
      <Row className="vh-100 d-flex justify-content-center">
        <Col xs={12} className="align-self-center">
          <CardBody>
            <Row>
              <Col lg={4} className="mx-auto">
                <Card>
                  <CardBody className="p-0 bg-black auth-header-box rounded-top">
                    <div className="text-center p-3">
                      <Link href="/" className="logo logo-admin">
                        <Image src={logoSm} height={50} alt="logo" className="auth-logo" />
                      </Link>
                      <h4 className="mt-3 mb-1 fw-semibold text-white fs-18">Opa! Página não encontrada</h4>
                      <p className="text-muted fw-medium mb-0">Voltar ao painel do Rumo Saudável</p>
                    </div>
                  </CardBody>
                  <CardBody>
                    <div className="ex-page-content text-center">
                      <h1 className="my-2">404!</h1>
                      <h5 className="fs-16 text-muted mb-3">Algo deu errado</h5>
                    </div>
                    <Link href="/" className="btn btn-primary w-100">
                      Voltar ao painel <IconifyIcon icon="fa-solid:redo" className="ms-1" />
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Col>
      </Row>
    </div>
  )
}

export default NotFound
