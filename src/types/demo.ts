export type DemoEmpresa = (typeof import('@/assets/data/demo-data').EMPRESAS_DEMO)[number]
export type DemoParticipante = (typeof import('@/assets/data/demo-data').PARTICIPANTES_DEMO)[number]
export type DemoQuestionario = (typeof import('@/assets/data/demo-data').QUESTIONARIOS_DEMO)[number]
export type DemoPrograma = (typeof import('@/assets/data/demo-data').PROGRAMAS_DEMO)[number]
export type DemoAlerta = (typeof import('@/assets/data/demo-data').ALERTAS_DEMO)[number]
export type DemoUsuario = (typeof import('@/assets/data/demo-data').USUARIOS_DEMO)[number]
export type DemoPergunta = (typeof import('@/assets/data/demo-data').PERGUNTAS_DEMO)[number]
export type DemoAlternativa = (typeof import('@/assets/data/demo-data').ALTERNATIVAS_DEMO)[number]
export type DemoDimensao = (typeof import('@/assets/data/demo-data').DIMENSOES_DEMO)[number]
export type DemoGrupo = (typeof import('@/assets/data/demo-data').GRUPOS_DEMO)[number]

export type DemoProgramaQuestionarioVinculo = {
  id: number
  questionarioId: number
  ordem: number
  obrigatorio: boolean
  permiteReavaliacao: boolean
  intervaloDias: number
  dependenciaId?: number
  dependenciaCondicao?: string
}

export type DemoProgramaEmpresaVinculo = {
  id: number
  empresaId: number
  intervaloInicio?: string | null
  intervaloFim?: string | null
  indeterminado: boolean
  acessoPublicoAtivo: boolean
  usuariosPermitidos: number[]
  createdAt: string
  updatedAt: string
}

export type DemoProgramaComVinculos = DemoPrograma & {
  empresasVinculadas?: DemoProgramaEmpresaVinculo[]
}

export type DemoState = {
  empresas: DemoEmpresa[]
  participantes: DemoParticipante[]
  questionarios: DemoQuestionario[]
  programas: DemoProgramaComVinculos[]
  alertas: DemoAlerta[]
  usuarios: DemoUsuario[]
  perguntas: DemoPergunta[]
  alternativas: DemoAlternativa[]
  dimensoes: DemoDimensao[]
  grupos: DemoGrupo[]
}
