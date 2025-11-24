'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import useQueryParams from '@/hooks/useQueryParams'
import { useNotificationContext } from '@/context/useNotificationContext'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const { showNotification } = useNotificationContext()

  const queryParams = useQueryParams()

  const loginFormSchema = yup.object({
    login: yup.string().required('Por favor, insira seu login'),
    password: yup.string().required('Por favor, insira sua senha'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      login: 'Davi2022',
      password: 'Rumo2023',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true)
    signIn('credentials', {
      redirect: false,
      login: values?.login,
      password: values?.password,
    }).then((res) => {
      if (res?.ok) {
        push(queryParams['redirectTo'] ?? '/inicio')
        showNotification({ message: 'Login realizado com sucesso. Redirecionando....', variant: 'success' })
      } else {
        showNotification({ message: res?.error ?? '', variant: 'danger' })
      }
    })
    setLoading(false)
  })

  return { loading, login, control }
}

export default useSignIn
