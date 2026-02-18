/**
 * Tipos para Empresas
 */

export interface Empresa {
  id: number
  nome: string
  cor: string
  introducao?: string
  termo?: string
  logo?: string
  slug?: string
  total_cadastrados?: number
  total_respondentes?: number
  total_questionarios?: number
  created_at?: string
  updated_at?: string
}

export interface EmpresaFormData {
  empresa_nome: string
  empresa_introducao?: string
  empresa_cor: string
  empresa_termo?: string | boolean
  empresa_logo?: File
}

export interface CreateEmpresaParams {
  empresa_nome: string
  empresa_introducao?: string
  empresa_cor: string
  empresa_termo?: string
  empresa_logo?: File
}

export interface UpdateEmpresaParams {
  id: number
  data: CreateEmpresaParams
}
