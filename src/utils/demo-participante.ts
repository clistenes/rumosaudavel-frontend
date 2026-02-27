import type { Session } from 'next-auth'

type DemoParticipanteLike = {
  id: number
  email?: string
  empresaId?: number
  nome?: string
  phq9Score?: number
  gad7Score?: number
}

export type DemoResposta = {
  perguntaId: number
  pergunta: string
  resposta: string
  valor: number
}

export type DemoQuestionarioSubmission = {
  participanteKey: string
  participanteId: number
  questionarioId: number
  score: number
  respostas: DemoResposta[]
  submittedAt: string
}

const STORAGE_KEY = 'rumosaudavel:demo-participante-submissoes:v1'

const canUseStorage = () => typeof window !== 'undefined'

export const resolveParticipanteFromSession = (
  session: Session | null,
  participantes: DemoParticipanteLike[]
) => {
  const sessionId = Number(session?.user?.id || 0)
  const sessionEmail = String(session?.user?.email || '').toLowerCase()
  const sessionEmpresaId = Number(session?.user?.id_empresa || 0)

  if (sessionId > 0) {
    const byId = participantes.find((item) => Number(item.id) === sessionId)
    if (byId) return byId
  }

  if (sessionEmail) {
    const byEmail = participantes.find((item) => String(item.email || '').toLowerCase() === sessionEmail)
    if (byEmail) return byEmail
  }

  if (sessionEmpresaId > 0) {
    const byEmpresa = participantes.find((item) => Number(item.empresaId) === sessionEmpresaId)
    if (byEmpresa) return byEmpresa
  }

  return participantes[0] || null
}

export const getParticipanteKey = (participante: DemoParticipanteLike | null, session: Session | null) => {
  if (participante?.email) return String(participante.email).toLowerCase()
  if (session?.user?.email) return String(session.user.email).toLowerCase()
  return `participante:${participante?.id || session?.user?.id || 'anon'}`
}

const parseStoredSubmissoes = (): DemoQuestionarioSubmission[] => {
  if (!canUseStorage()) return []

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as DemoQuestionarioSubmission[]
  } catch (error) {
    console.error('Erro ao ler submissoes demo', error)
    return []
  }
}

const persistSubmissoes = (items: DemoQuestionarioSubmission[]) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const listSubmissoesParticipante = (participanteKey: string) =>
  parseStoredSubmissoes()
    .filter((item) => item.participanteKey === participanteKey)
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))

export const getSubmissaoByQuestionario = (participanteKey: string, questionarioId: number) =>
  parseStoredSubmissoes().find(
    (item) => item.participanteKey === participanteKey && Number(item.questionarioId) === Number(questionarioId)
  ) || null

export const saveSubmissaoQuestionario = (payload: DemoQuestionarioSubmission) => {
  const current = parseStoredSubmissoes()
  const next = current.filter(
    (item) =>
      !(
        item.participanteKey === payload.participanteKey &&
        Number(item.questionarioId) === Number(payload.questionarioId)
      )
  )
  next.push(payload)
  persistSubmissoes(next)
}

export const deleteSubmissaoQuestionario = (participanteKey: string, questionarioId: number) => {
  const current = parseStoredSubmissoes()
  const next = current.filter(
    (item) =>
      !(
        item.participanteKey === participanteKey &&
        Number(item.questionarioId) === Number(questionarioId)
      )
  )
  persistSubmissoes(next)
}

export const getRiscoByScore = (
  faixas: Array<{ min: number; max: number; risco: string; descricao: string }>,
  score: number
) => faixas.find((faixa) => score >= faixa.min && score <= faixa.max) || null

export const normalizeRisco = (phq9: number, gad7: number) => {
  if (phq9 >= 15 || gad7 >= 15) return 'alto'
  if (phq9 >= 10 || gad7 >= 10) return 'medio'
  return 'baixo'
}
