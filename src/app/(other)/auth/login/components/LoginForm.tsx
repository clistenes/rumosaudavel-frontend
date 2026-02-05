'use client'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import useSignIn from '../useSignIn'
import { Col } from 'react-bootstrap'

const LoginForm = () => {
  const { loading, login, control } = useSignIn()

  return (
    <form onSubmit={login} className="my-4">
      <TextFormInput control={control} name="login" label="Login" containerClassName="form-group mb-2" placeholder="Digite seu login" />

      <PasswordFormInput control={control} name="password" label="Senha" containerClassName="form-group" placeholder="Digite sua senha" />

      <div className="form-group row mt-3">
        <Col sm={6} className="">
          <Link href="/auth/esqueci-senha" className="text-muted font-13">
            Esqueceu a senha?
          </Link>
        </Col>
      </div>
      <div className="form-group mb-0 row">
        <Col xs={12}>
          <div className="d-grid mt-3">
            <button className="btn btn-primary flex-centered" type="submit" disabled={loading}>
              Entrar<IconifyIcon icon="fa6-solid:right-to-bracket" className="ms-1" />
            </button>
          </div>
        </Col>
      </div>
    </form>
  )
}

export default LoginForm
