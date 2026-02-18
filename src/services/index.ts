/**
 * Exportação centralizada de todos os serviços
 * 
 * Uso:
 * import { empresaService, participanteService } from '@/services'
 */

export { http, API_CONFIG, API_ENDPOINTS } from './http.service'
export { empresaService } from './empresa.service'
export { participanteService } from './participante.service'
export { programaService } from './programa.service'
export { questionarioService } from './questionario.service'
export { relatorioService } from './relatorio.service'

// Re-exportar tipos
export type { 
  ListarEmpresasParams 
} from './empresa.service'
export type {
  Empresa,
  EmpresaFormData,
  CreateEmpresaParams,
  UpdateEmpresaParams
} from '@/types/empresa'
export type {
  ListarParticipantesParams,
  CriarParticipanteData 
} from './participante.service'
export type { 
  ListarProgramasParams,
  CriarProgramaData,
  VincularQuestionarioData 
} from './programa.service'
export type { 
  ListarQuestionariosParams,
  CriarQuestionarioData,
  ResponderQuestionarioData 
} from './questionario.service'
export type { 
  RelatorioAnaliticoParams,
  RelatorioGraficoParams,
  ExportarRelatorioParams 
} from './relatorio.service'
