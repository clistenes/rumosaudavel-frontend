/**
 * Camada de compatibilidade da demo.
 *
 * Fonte unica de dados: demo-db.json
 */

import demoDb from './demo-db.json'
import type { DemoDatabase } from '@/types/demo'

const db = demoDb as DemoDatabase

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const EMPRESAS_DEMO = clone(db.empresas)
export const PARTICIPANTES_DEMO = clone(db.participantes)
export const PROGRAMAS_DEMO = clone(db.programas)
export const QUESTIONARIOS_DEMO = clone(db.questionarios)
export const PERGUNTAS_DEMO = clone(db.perguntas)
export const ALTERNATIVAS_DEMO = clone(db.alternativas)
export const DIMENSOES_DEMO = clone(db.dimensoes)
export const GRUPOS_DEMO = clone(db.grupos)
export const USUARIOS_DEMO = clone(db.usuarios)
export const ALERTAS_DEMO = clone(db.alertas)
export const ESTATISTICAS_GLOBAIS = clone(db.estatisticas)
export const EVOLUCAO_MENSAL = clone(db.evolucao)

export function getEmpresaById(id: number) {
  return EMPRESAS_DEMO.find((empresa) => Number(empresa.id) === Number(id)) || null
}

export function getParticipanteById(id: number) {
  return PARTICIPANTES_DEMO.find((participante) => Number(participante.id) === Number(id)) || null
}

export function getParticipantesByEmpresa(empresaId: number) {
  return PARTICIPANTES_DEMO.filter((participante) => Number(participante.empresaId) === Number(empresaId))
}

export function getAlertasByEmpresa(empresaId: number) {
  return ALERTAS_DEMO.filter((alerta) => Number(alerta.empresaId) === Number(empresaId))
}

export function getStatusRiscoBadge(risco: string) {
  const badges = {
    baixo: { variant: 'success', label: 'Baixo Risco', color: '#198754' },
    medio: { variant: 'warning', label: 'Risco Moderado', color: '#ffc107' },
    alto: { variant: 'danger', label: 'Alto Risco', color: '#dc3545' },
  }

  return badges[risco as keyof typeof badges] || badges.baixo
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '')

  if (cleaned.length <= 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  return cnpj
}

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')

  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return cpf
}

export function formatTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return telefone
}
