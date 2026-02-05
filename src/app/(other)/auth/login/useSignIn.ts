'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  // Efeito para redirecionar após login bem-sucedido
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.type) {
      const callbackUrl = searchParams?.get('callbackUrl')
      
      if (callbackUrl) {
        push(callbackUrl)
        return
      }

      // Redirecionar baseado no tipo de usuário
      switch (session.user.type) {
        case 1:
          push('/inicio')
          break
        case 2:
          push('/participante')
          break
        case 3:
          push('/empresa')
          break
        default:
          push('/auth/login')
      }
    }
  }, [session, status, push, searchParams])

  const loginFormSchema = yup.object({
    login: yup.string().required('Por favor, insira seu login'),
    password: yup.string().required('Por favor, insira sua senha'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        login: values.login,
        password: values.password,
      })

      if (result?.ok) {
        toast.success('Login realizado com sucesso!', {
          description: 'Redirecionando...',
        })
        // O redirecionamento será feito pelo useEffect quando a sessão atualizar
      } else {
        toast.error('Erro ao fazer login', {
          description: result?.error || 'Credenciais inválidas',
        })
      }
    } catch (error) {
      toast.error('Erro ao fazer login', {
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  })

  return { loading, login, control }
}

export default useSignIn
