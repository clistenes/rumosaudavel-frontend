'use client'

import { useState } from 'react'
import { Card, Button, Alert, ProgressBar } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'

export default function BoasVindas() {
  const [showTermo, setShowTermo] = useState(false)
  const [aceitouTermo, setAceitouTermo] = useState(false)

  const questionariosPendentes = [
    { id: 1, nome: 'Avaliação de Saúde Mental', status: 'pendente', progresso: 0 },
    { id: 2, nome: 'Bem-estar no Trabalho', status: 'pendente', progresso: 0 },
  ]

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <IconifyIcon 
                  icon="iconoir:health-shield" 
                  className="text-primary" 
                  style={{ fontSize: '64px' }} 
                />
              </div>
              
              <h1 className="display-5 fw-bold mb-3">Bem-vindo ao Rumo Saudável!</h1>
              
              <p className="lead text-muted mb-4">
                Sua participação é importante para promover a saúde e o bem-estar 
                no ambiente de trabalho. Responda aos questionários de forma honesta 
                e siga as orientações.
              </p>

              {!aceitouTermo ? (
                <>
                  <Alert variant="info" className="text-start">
                    <h5 className="alert-heading">
                      <IconifyIcon icon="iconoir:privacy-policy" className="me-2" />
                      Termo de Consentimento
                    </h5>
                    <p>
                      Para continuar, você precisa aceitar o termo de consentimento. 
                      Seus dados serão tratados de forma confidencial e utilizados 
                      apenas para fins de pesquisa e melhoria do ambiente de trabalho.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => setShowTermo(!showTermo)}
                      >
                        {showTermo ? 'Ocultar' : 'Ler'} Termo Completo
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setAceitouTermo(true)}
                      >
                        Aceitar e Continuar
                      </Button>
                    </div>
                  </Alert>

                  {showTermo && (
                    <Card className="mt-3 text-start">
                      <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <h6>TERMOS E CONDIÇÕES DE USO</h6>
                        <p className="small text-muted">
                          1. O participante concorda em fornecer informações verdadeiras...<br /><br />
                          2. Os dados coletados serão armazenados de forma segura...<br /><br />
                          3. A participação é voluntária e pode ser interrompida a qualquer momento...<br /><br />
                          4. Os resultados serão utilizados para melhorias no ambiente de trabalho...<br /><br />
                          5. A identidade do participante será mantida em sigilo...
                        </p>
                      </Card.Body>
                    </Card>
                  )}
                </>
              ) : (
                <>
                  <Alert variant="success">
                    <IconifyIcon icon="iconoir:check-circle" className="me-2" />
                    Termo aceito! Você pode começar a responder os questionários.
                  </Alert>

                  <div className="text-start mt-4">
                    <h5 className="mb-3">Questionários Disponíveis:</h5>
                    {questionariosPendentes.map((q) => (
                      <Card key={q.id} className="mb-3 border-primary">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">{q.nome}</h6>
                            <span className="badge bg-warning">Pendente</span>
                          </div>
                          <ProgressBar 
                            now={q.progresso} 
                            label={`${q.progresso}%`} 
                            className="mb-3"
                          />
                          <Link href={`/participante/questionario/${q.id}`}>
                            <Button variant="primary" className="w-100">
                              <IconifyIcon icon="iconoir:play" className="me-2" />
                              Começar Questionário
                            </Button>
                          </Link>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}
