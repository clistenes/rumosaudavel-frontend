export type DemoEmpresa = {
  id: number
  nome: string
  nomeCurto?: string
  cnpj?: string
  setor?: string
  cidade?: string
  estado?: string
  email?: string
  telefone?: string
  participantes?: number
  totalParticipantes?: number
  adesao?: number
  phq9Medio?: number
  gad7Medio?: number
  riscoAlto?: number
  riscoMedio?: number
  riscoBaixo?: number
  status?: string
  dataCadastro?: string
  dataCriacao?: string
  [key: string]: unknown
}

export type DemoParticipante = {
  id: number
  empresaId: number
  nome: string
  email?: string
  cpf?: string
  telefone?: string
  cargo?: string
  departamento?: string
  dataNascimento?: string
  dataAdmissao?: string
  sexo?: string
  estadoCivil?: string
  cidade?: string
  estado?: string
  status?: string
  riscoSaude?: 'baixo' | 'medio' | 'alto' | string
  phq9Score?: number
  gad7Score?: number
  ultimaAvaliacao?: string
  alertasPendentes?: number
  [key: string]: unknown
}

export type DemoQuestionario = {
  id: number
  nome?: string
  codigo?: string
  titulo?: string
  descricao?: string
  categoria?: string
  tipo?: string
  status?: string
  numeroQuestoes?: number
  escoreMaximo?: number
  faixasRisco?: Array<{ min: number; max: number; risco: string; descricao: string }>
  tempoEstimadoMinutos?: number
  aplicacoesTotal?: number
  aplicacoesUltimoMes?: number
  [key: string]: unknown
}

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

export type DemoPrograma = {
  id: number
  nome: string
  descricao?: string
  status?: string
  dataInicio?: string
  dataFim?: string
  duracaoMeses?: number
  empresasParticipantes?: number[]
  empresasVinculadas?: DemoProgramaEmpresaVinculo[]
  questionariosVinculados?: DemoProgramaQuestionarioVinculo[]
  participantesAtivos?: number
  avaliacaoMedia?: number
  sessoesRealizadas?: number
  [key: string]: unknown
}

export type DemoAlerta = {
  id: number
  tipo: string
  prioridade?: string
  titulo: string
  mensagem: string
  participanteId?: number
  empresaId?: number
  dataCriacao?: string
  dataLeitura?: string | null
  status?: string
  acaoRecomendada?: string
  [key: string]: unknown
}

export type DemoUsuario = {
  id: number
  nome: string
  email?: string
  login?: string
  role?: string
  status?: string
  empresaId?: number | null
  [key: string]: unknown
}

export type DemoPergunta = {
  id: number
  id_questionario: number
  id_dependente?: number | null
  pos?: number
  nome?: string
  nome_curto?: string
  explicacao?: string
  escolha_hipotese?: string
  grupo_nome?: string | null
  grupo_pos?: number | null
  dimensao_nome?: string | null
  dimensao_pos?: number | null
  tipo_dependente?: string | null
  s_pontuacao?: number | null
  n_pontuacao?: number | null
  s_tipo?: string | null
  n_tipo?: string | null
  s_comentario?: string | null
  n_comentario?: string | null
  flag?: string | null
  flag_ansiedade?: string | null
  id_clonagem?: number | null
  created_at?: string
  updated_at?: string
  tipo?: string
  [key: string]: unknown
}

export type DemoAlternativa = {
  id: number
  id_pergunta: number
  id_questionario: number
  alternativa?: string
  pontuacao?: number
  [key: string]: unknown
}

export type DemoDimensao = {
  id: number
  id_questionario: number
  nome?: string
  pos?: number
  [key: string]: unknown
}

export type DemoGrupo = {
  id: number
  id_dimensao?: number
  id_questionario: number
  nome?: string
  pos?: number
  [key: string]: unknown
}

export type DemoProgramaComVinculos = DemoPrograma & {
  empresasVinculadas?: DemoProgramaEmpresaVinculo[]
}

export type DemoEstatisticas = Record<string, number | string>
export type DemoEvolucao = Record<string, number | string>

export type DemoDatabase = {
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
  estatisticas: DemoEstatisticas
  evolucao: DemoEvolucao[]
}

export type DemoState = DemoDatabase

export type DemoIntegrityIssue = {
  code:
    | 'missing_empresa_for_participante'
    | 'missing_empresa_for_programa_vinculo'
    | 'missing_questionario_for_pergunta'
    | 'missing_pergunta_for_alternativa'
    | 'invalid_usuario_empresa'
  entity: string
  id: number
  field?: string
  message: string
}
