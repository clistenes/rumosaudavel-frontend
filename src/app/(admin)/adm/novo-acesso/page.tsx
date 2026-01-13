// 'use client'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import React from 'react'
import { Button, Col, Form, FormControl, FormLabel, Row } from 'react-bootstrap'


export const metadata = { title: 'Tutoriais' }

const NovoAcesso = () => {
  return (
    <>
      <PageTitle title='Novo Acesso'  />
      <Row>
        <Col>
        <ComponentContainerCard title="Basic Form">
      <Form>
        <div className="mb-3">
          <FormLabel htmlFor="exampleInputEmail1">Email address</FormLabel>
          <FormControl type="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">
            We&apos;ll never share your email with anyone else.
          </small>
        </div>
        <div className="mb-3">
          <FormLabel htmlFor="exampleInputPassword1">Password</FormLabel>
          <FormControl type="password" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="flexCheckDefaultdemo" />
          <label className="form-check-label" htmlFor="flexCheckDefaultdemo">
            Check me out
          </label>
        </div>
        <Button type="submit" variant="primary" className="me-1">
          Submit
        </Button>
        <Button type="button" variant="danger">
          Cancel
        </Button>
      </Form>
    </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
export default NovoAcesso