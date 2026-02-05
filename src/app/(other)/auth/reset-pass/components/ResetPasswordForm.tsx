'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { toast } from 'sonner'

import TextFormInput from '@/components/form/TextFormInput'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { authService } from '@/services/auth'
import { Col, Row } from 'react-bootstrap'

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const resetPasswordSchema = yup.object({
    email: yup.string().email('Digite um email válido').required('Email é obrigatório'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    
    try {
      const response = await authService.forgotPassword(values.email)
      
      if (response.success) {
        setEmailSent(true)
        toast.success('Email enviado!', {
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        })
      } else {
        toast.error('Erro', {
          description: response.message || 'Não foi possível enviar o email.',
        })
      }
    } catch (error) {
      toast.error('Erro', {
        description: 'Ocorreu um erro ao enviar o email. Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  })

  if (emailSent) {
    return (
      <div className="text-center my-4">
        <div className="alert alert-success" role="alert">
          <IconifyIcon icon="fa6-solid:circle-check" className="me-2" />
          Email enviado com sucesso!
        </div>
        <p className="text-muted">
          Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
        </p>
      </div>
    )
  }

  return (
    <form className="my-4" onSubmit={onSubmit}>
      <TextFormInput 
        control={control} 
        name="email" 
        label="Email" 
        placeholder="Digite seu email" 
        containerClassName="form-group mb-2" 
      />

      <Row className="form-group mb-0">
        <Col xs={12}>
          <div className="d-grid mt-3">
            <button className="btn btn-primary flex-centered" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar <IconifyIcon icon="fa6-solid:paper-plane" className="ms-1" />
                </>
              )}
            </button>
          </div>
        </Col>
      </Row>
    </form>
  )
}

export default ResetPasswordForm
