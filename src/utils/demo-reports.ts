import type { DemoEmpresa, DemoParticipante } from '@/types/demo'

type Risco = 'baixo' | 'medio' | 'alto'

const normalizeRisco = (participante: any): Risco => {
  if (participante.riscoSaude === 'alto' || participante.riscoSaude === 'medio' || participante.riscoSaude === 'baixo') {
    return participante.riscoSaude
  }

  const phq = Number(participante.phq9Score || 0)
  const gad = Number(participante.gad7Score || 0)
  if (phq >= 15 || gad >= 15) return 'alto'
  if (phq >= 10 || gad >= 10) return 'medio'
  return 'baixo'
}

export const getEmpresaParticipantes = (participantes: DemoParticipante[], empresaId?: number | null) => {
  if (!empresaId) return participantes
  return participantes.filter((participante: any) => Number(participante.empresaId) === Number(empresaId))
}

export const getEmpresaResumo = (participantes: DemoParticipante[]) => {
  const total = participantes.length
  const ativos = participantes.filter((participante: any) => participante.status !== 'inativo').length
  const alto = participantes.filter((participante: any) => normalizeRisco(participante) === 'alto').length
  const medio = participantes.filter((participante: any) => normalizeRisco(participante) === 'medio').length
  const baixo = participantes.filter((participante: any) => normalizeRisco(participante) === 'baixo').length
  const mediaPhq9 = total > 0 ? participantes.reduce((acc: number, participante: any) => acc + Number(participante.phq9Score || 0), 0) / total : 0
  const mediaGad7 = total > 0 ? participantes.reduce((acc: number, participante: any) => acc + Number(participante.gad7Score || 0), 0) / total : 0

  return { total, ativos, alto, medio, baixo, mediaPhq9, mediaGad7 }
}

export const getSetoresResumo = (participantes: DemoParticipante[]) => {
  const setores = Array.from(new Set(participantes.map((participante: any) => participante.departamento || 'Geral')))

  return setores.map((setor) => {
    const base = participantes.filter((participante: any) => (participante.departamento || 'Geral') === setor)
    const total = base.length
    const alto = base.filter((participante: any) => normalizeRisco(participante) === 'alto').length
    const medio = base.filter((participante: any) => normalizeRisco(participante) === 'medio').length
    const baixo = base.filter((participante: any) => normalizeRisco(participante) === 'baixo').length
    const mediaPhq9 = total > 0 ? base.reduce((acc: number, participante: any) => acc + Number(participante.phq9Score || 0), 0) / total : 0
    const mediaGad7 = total > 0 ? base.reduce((acc: number, participante: any) => acc + Number(participante.gad7Score || 0), 0) / total : 0

    return { setor, total, alto, medio, baixo, mediaPhq9, mediaGad7 }
  })
}

export const getEmpresaAtual = (empresas: DemoEmpresa[], empresaId?: number | null) => {
  if (!empresaId) return null
  return empresas.find((empresa: any) => Number(empresa.id) === Number(empresaId)) || null
}

