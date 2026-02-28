import seedJson from '@/assets/data/demo-db.json'
import type { DemoDatabase, DemoIntegrityIssue } from '@/types/demo'

const STORAGE_KEY = 'rumosaudavel:demo-db:v2'

let memoryState: DemoDatabase | null = null

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const asDatabase = () => clone(seedJson as DemoDatabase)

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

export const getSeedState = (): DemoDatabase => asDatabase()

export const getState = (): DemoDatabase => {
  if (!canUseStorage()) {
    memoryState = memoryState || getSeedState()
    return clone(memoryState)
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seed = getSeedState()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }

  try {
    const parsed = JSON.parse(raw) as DemoDatabase
    return clone(parsed)
  } catch {
    const seed = getSeedState()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
}

export const setState = (state: DemoDatabase): DemoDatabase => {
  const nextState = clone(state)

  if (!canUseStorage()) {
    memoryState = nextState
    return clone(nextState)
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  return clone(nextState)
}

export const patchState = (
  updater: (prev: DemoDatabase) => DemoDatabase
): DemoDatabase => {
  const prev = getState()
  const next = updater(clone(prev))
  return setState(next)
}

export const resetState = (): DemoDatabase => {
  const seed = getSeedState()

  if (!canUseStorage()) {
    memoryState = seed
    return clone(seed)
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return clone(seed)
}

export const validateState = (state: DemoDatabase = getState()): DemoIntegrityIssue[] => {
  const issues: DemoIntegrityIssue[] = []

  const empresaIds = new Set(state.empresas.map((item) => Number(item.id)))
  const questionarioIds = new Set(state.questionarios.map((item) => Number(item.id)))
  const perguntaIds = new Set(state.perguntas.map((item) => Number(item.id)))

  state.participantes.forEach((participante) => {
    if (!empresaIds.has(Number(participante.empresaId))) {
      issues.push({
        code: 'missing_empresa_for_participante',
        entity: 'participantes',
        id: Number(participante.id),
        field: 'empresaId',
        message: `Participante ${participante.id} referencia empresa inexistente (${participante.empresaId})`,
      })
    }
  })

  state.programas.forEach((programa) => {
    const vinculos = Array.isArray(programa.empresasVinculadas)
      ? programa.empresasVinculadas
      : (programa.empresasParticipantes || []).map((empresaId) => ({ empresaId, id: 0 }))

    vinculos.forEach((vinculo) => {
      if (!empresaIds.has(Number(vinculo.empresaId))) {
        issues.push({
          code: 'missing_empresa_for_programa_vinculo',
          entity: 'programas',
          id: Number(programa.id),
          field: 'empresasVinculadas.empresaId',
          message: `Programa ${programa.id} referencia empresa inexistente (${vinculo.empresaId})`,
        })
      }
    })
  })

  state.perguntas.forEach((pergunta) => {
    if (!questionarioIds.has(Number(pergunta.id_questionario))) {
      issues.push({
        code: 'missing_questionario_for_pergunta',
        entity: 'perguntas',
        id: Number(pergunta.id),
        field: 'id_questionario',
        message: `Pergunta ${pergunta.id} referencia questionario inexistente (${pergunta.id_questionario})`,
      })
    }
  })

  state.alternativas.forEach((alternativa) => {
    if (!perguntaIds.has(Number(alternativa.id_pergunta))) {
      issues.push({
        code: 'missing_pergunta_for_alternativa',
        entity: 'alternativas',
        id: Number(alternativa.id),
        field: 'id_pergunta',
        message: `Alternativa ${alternativa.id} referencia pergunta inexistente (${alternativa.id_pergunta})`,
      })
    }
  })

  state.usuarios.forEach((usuario) => {
    if (usuario.empresaId != null && !empresaIds.has(Number(usuario.empresaId))) {
      issues.push({
        code: 'invalid_usuario_empresa',
        entity: 'usuarios',
        id: Number(usuario.id),
        field: 'empresaId',
        message: `Usuario ${usuario.id} referencia empresa inexistente (${usuario.empresaId})`,
      })
    }
  })

  return issues
}

export const demoDbService = {
  storageKey: STORAGE_KEY,
  getSeedState,
  getState,
  setState,
  patchState,
  resetState,
  validateState,
}
