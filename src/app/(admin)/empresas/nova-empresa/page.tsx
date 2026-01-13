
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { use } from 'react'
import { Button, Form, FormControl, FormLabel, Row, Table } from 'react-bootstrap'
import * as yup from 'yup'
import { EmpresaFormData } from './empresaFormData'
import EmpresaForm from './components/EmpresaForm'


export const metadata = { title: 'Todas as Empresas' }

const NovaEmpresa = () => {


  return (
        <>
        <PageTitle title='Nova Empresa' subName='Empresas'  />
        <Row>
          <ComponentContainerCard title="">
            <EmpresaForm />
          </ComponentContainerCard>
        </Row>
        </>
  )
}

export default NovaEmpresa