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
  const [error, setError] = useState<string | null>(null)
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

      // Converter para número para garantir comparação correta
      const userType = Number(session.user.type)
      console.log('🔄 [useSignIn] Redirecionando usuário tipo:', userType, typeof session.user.type)

      // Redirecionar baseado no tipo de usuário
      switch (userType) {
        case 1:
          console.log('🔄 [useSignIn] Admin → /inicio')
          push('/inicio')
          break
        case 2:
          console.log('🔄 [useSignIn] Participante → /participante')
          push('/participante')
          break
        case 3:
          console.log('🔄 [useSignIn] Empresa → /empresa')
          push('/empresa')
          break
        default:
          // Permanece na página se tipo não reconhecido
          console.error('Tipo de usuário não reconhecido:', userType)
      }
    }
  }, [session, status, push, searchParams])

  const loginFormSchema = yup.object({
    login: yup.string().required('Por favor, insira seu login'),
    password: yup.string().required('Por favor, insira sua senha'),
  })

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Tentando login com:', values.login)
      
      const result = await signIn('credentials', {
        redirect: false,
        login: values.login,
        password: values.password,
      })

      console.log('Resultado do login:', result)

      if (result?.ok) {
        toast.success('Login realizado com sucesso!', {
          description: 'Redirecionando...',
        })
        // O redirecionamento será feito pelo useEffect quando a sessão atualizar
      } else {
        const errorMessage = result?.error || 'Credenciais inválidas'
        console.error('Erro ao fazer login:', errorMessage)
        setError(errorMessage)
        toast.error('Erro ao fazer login', {
          description: errorMessage,
        })
        // Limpa a senha para nova tentativa
        setValue('password', '')
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error)
      const errorMsg = 'Ocorreu um erro inesperado. Tente novamente.'
      setError(errorMsg)
      toast.error('Erro ao fazer login', {
        description: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  })

  return { loading, login, control, error }
}

export default useSignIn
