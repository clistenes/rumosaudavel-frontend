/**
 * Exportação centralizada dos hooks de API
 */

export { useFetch, useMutation, usePaginatedFetch } from './useFetch'
export {
  useEmpresas,
  useEmpresa,
  useEmpresaDashboard,
  useCriarEmpresa,
  useAtualizarEmpresa,
  useRemoverEmpresa,
  useParticipantesEmpresa,
} from './useEmpresas'

export {
  useParticipantes,
  useParticipante,
  useIndicadoresSaude,
  useCriarParticipante,
  useCriarParticipantesLote,
  useAtualizarParticipante,
  useRemoverParticipante,
  useImportarParticipantesExcel,
  useImportarParticipantesTexto,
} from './useParticipantes'

export {
  useProgramas,
  usePrograma,
  useCriarPrograma,
  useAtualizarPrograma,
  useRemoverPrograma,
  useQuestionariosPrograma,
  useVincularQuestionario,
  useDesvincularQuestionario,
} from './useProgramas'

export {
  useQuestionarios,
  useQuestionario,
  useCriarQuestionario,
  useAtualizarQuestionario,
  useRemoverQuestionario,
  usePerguntasQuestionario,
  useResponderQuestionario,
} from './useQuestionarios'

export {
  useUsuarios,
  useUsuario,
  useCriarUsuario,
  useAtualizarUsuario,
  useRemoverUsuario,
} from './useUsuarios'
