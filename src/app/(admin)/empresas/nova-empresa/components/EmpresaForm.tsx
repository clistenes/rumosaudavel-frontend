'use client'  
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { empresaSchema } from '../Schema'
import { EmpresaFormData } from '../empresaFormData'

interface EmpresaFormProps {
  onSubmit: SubmitHandler<EmpresaFormData>
  defaultValues?: Partial<EmpresaFormData>
}

const EmpresaForm = () => {
  const onSubmit: SubmitHandler<EmpresaFormData> = (data) => {
    console.log(data)
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormData>({
    resolver: yupResolver(empresaSchema),
    defaultValues: {
      termo: false,
    },
  })

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Form.Group className="mb-3">
        <Form.Label>Empresa</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o nome da empresa"
          isInvalid={!!errors.empresa}
          {...register('empresa')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.empresa?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Introdução</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Digite a introdução"
          isInvalid={!!errors.introducao}
          {...register('introducao')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.introducao?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Aceito os termos"
          {...register('termo')}
        />
      </Form.Group>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Criar'}
      </Button>

    </Form>
  )
}

export default EmpresaForm
