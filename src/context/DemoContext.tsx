'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type {
  DemoAlerta,
  DemoAlternativa,
  DemoDimensao,
  DemoEmpresa,
  DemoGrupo,
  DemoIntegrityIssue,
  DemoDatabase,
  DemoParticipante,
  DemoPergunta,
  DemoProgramaComVinculos,
  DemoProgramaEmpresaVinculo,
  DemoProgramaQuestionarioVinculo,
  DemoQuestionario,
  DemoState,
  DemoUsuario,
} from '@/types/demo'
import { demoDbService } from '@/services/demo-db.service'

interface DemoContextType {
  // Dados
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
  
  // Actions Empresas
  addEmpresa: (empresa: any) => void
  updateEmpresa: (id: number, data: any) => void
  deleteEmpresa: (id: number) => void
  
  // Actions Participantes
  addParticipante: (participante: any) => void
  updateParticipante: (id: number, data: any) => void
  deleteParticipante: (id: number) => void
  
  // Actions QuestionÃ¡rios
  addQuestionario: (questionario: any) => void
  updateQuestionario: (id: number, data: any) => void
  deleteQuestionario: (id: number) => void
  duplicarQuestionario: (id: number) => void
  reorderQuestionarios: (newOrder: number[]) => void
  
  // Actions Programas
  addPrograma: (programa: any) => void
  updatePrograma: (id: number, data: any) => void
  deletePrograma: (id: number) => void
  duplicarPrograma: (id: number) => void
  getProgramaQuestionarios: (programaId: number) => DemoProgramaQuestionarioVinculo[]
  setProgramaQuestionarios: (programaId: number, vinculos: DemoProgramaQuestionarioVinculo[]) => void
  getProgramaEmpresas: (programaId: number) => DemoProgramaEmpresaVinculo[]
  vincularEmpresaPrograma: (programaId: number, empresaId: number) => void
  removerEmpresaPrograma: (programaId: number, vinculoId: number) => void
  atualizarIntervaloEmpresaPrograma: (
    programaId: number,
    vinculoId: number,
    payload: { intervaloInicio?: string | null; intervaloFim?: string | null; indeterminado?: boolean }
  ) => void
  atualizarUsuariosPermitidosPrograma: (programaId: number, vinculoId: number, userIds: number[]) => void
  toggleAcessoPublicoPrograma: (programaId: number, vinculoId: number) => void
  
  // Actions UsuÃ¡rios
  addUsuario: (usuario: any) => void
  updateUsuario: (id: number, data: any) => void
  deleteUsuario: (id: number) => void
  duplicarUsuario: (id: number) => void
  
  // Actions Perguntas
  addPergunta: (pergunta: any) => void
  updatePergunta: (id: number, data: any) => void
  deletePergunta: (id: number) => void
  getPerguntasByQuestionario: (questionarioId: number) => any[]
  reorderPerguntas: (questionarioId: number, newOrder: number[]) => void
  
  // Actions Alternativas
  addAlternativa: (alternativa: any) => void
  updateAlternativa: (id: number, data: any) => void
  deleteAlternativa: (id: number) => void
  getAlternativasByPergunta: (perguntaId: number) => any[]
  
  // Actions DimensÃµes
  addDimensao: (dimensao: any) => void
  updateDimensao: (id: number, data: any) => void
  deleteDimensao: (id: number) => void
  getDimensoesByQuestionario: (questionarioId: number) => any[]
  reorderDimensoes: (questionarioId: number, newOrder: number[]) => void
  
  // Actions Grupos
  addGrupo: (grupo: any) => void
  updateGrupo: (id: number, data: any) => void
  deleteGrupo: (id: number) => void
  getGruposByDimensao: (dimensaoId: number) => any[]
  getGruposByQuestionario: (questionarioId: number) => any[]
  reorderGrupos: (dimensaoId: number, newOrder: number[]) => void
  
  // Salvar ordem completa (hierarquia)
  salvarOrdemQuestionario: (questionarioId: number, estrutura: any[]) => void
  resetDemoState: () => void
  validateDemoState: () => DemoIntegrityIssue[]
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

const getInitialDemoState = (): DemoState => ({
  ...demoDbService.getSeedState(),
})

const nextNumericId = (items: Array<{ id: number }>) => Math.max(...items.map((item) => item.id), 0) + 1

const normalizeProgramas = (source: any[] | undefined): DemoProgramaComVinculos[] => {
  const now = new Date().toISOString()
  const programas = (source || []) as any[]

  return programas.map((programa) => {
    if (Array.isArray(programa.empresasVinculadas)) {
      return {
        ...programa,
        empresasVinculadas: programa.empresasVinculadas.map((vinculo: any, index: number) => ({
          id: Number(vinculo.id || Date.now() + index),
          empresaId: Number(vinculo.empresaId),
          intervaloInicio: vinculo.intervaloInicio ?? null,
          intervaloFim: vinculo.intervaloFim ?? null,
          indeterminado: Boolean(vinculo.indeterminado ?? true),
          acessoPublicoAtivo: Boolean(vinculo.acessoPublicoAtivo ?? false),
          usuariosPermitidos: Array.isArray(vinculo.usuariosPermitidos) ? vinculo.usuariosPermitidos.map((id: any) => Number(id)) : [],
          createdAt: vinculo.createdAt || now,
          updatedAt: vinculo.updatedAt || now,
        })),
      }
    }

    const legacyEmpresas = Array.isArray(programa.empresasParticipantes) ? programa.empresasParticipantes : []
    return {
      ...programa,
      empresasVinculadas: legacyEmpresas.map((empresaId: number, index: number) => ({
        id: Date.now() + index,
        empresaId: Number(empresaId),
        intervaloInicio: null,
        intervaloFim: null,
        indeterminado: true,
        acessoPublicoAtivo: false,
        usuariosPermitidos: [],
        createdAt: now,
        updatedAt: now,
      })),
    }
  })
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const initialState = getInitialDemoState()
  const [empresas, setEmpresas] = useState(initialState.empresas)
  const [participantes, setParticipantes] = useState(initialState.participantes)
  const [questionarios, setQuestionarios] = useState(initialState.questionarios)
  const [programas, setProgramas] = useState<DemoProgramaComVinculos[]>(normalizeProgramas(initialState.programas as any[]))
  const [alertas, setAlertas] = useState(initialState.alertas)
  const [usuarios, setUsuarios] = useState(initialState.usuarios)
  const [perguntas, setPerguntas] = useState(initialState.perguntas)
  const [alternativas, setAlternativas] = useState(initialState.alternativas)
  const [dimensoes, setDimensoes] = useState(initialState.dimensoes)
  const [grupos, setGrupos] = useState(initialState.grupos)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const parsedState = demoDbService.getState() as Partial<DemoState>
      const fallbackState = getInitialDemoState()

      setEmpresas(parsedState.empresas ?? fallbackState.empresas)
      setParticipantes(parsedState.participantes ?? fallbackState.participantes)
      setQuestionarios(parsedState.questionarios ?? fallbackState.questionarios)
      setProgramas(normalizeProgramas((parsedState.programas as any[]) ?? (fallbackState.programas as any[])))
      setAlertas(parsedState.alertas ?? fallbackState.alertas)
      setUsuarios(parsedState.usuarios ?? fallbackState.usuarios)
      setPerguntas(parsedState.perguntas ?? fallbackState.perguntas)
      setAlternativas(parsedState.alternativas ?? fallbackState.alternativas)
      setDimensoes(parsedState.dimensoes ?? fallbackState.dimensoes)
      setGrupos(parsedState.grupos ?? fallbackState.grupos)
    } catch (error) {
      console.error('Erro ao carregar estado da demo', error)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const stateToPersist: DemoDatabase = {
      empresas,
      participantes,
      questionarios,
      programas,
      alertas,
      usuarios,
      perguntas,
      alternativas,
      dimensoes,
      grupos,
      estatisticas: demoDbService.getState().estatisticas,
      evolucao: demoDbService.getState().evolucao,
    }

    demoDbService.setState(stateToPersist)
  }, [hydrated, empresas, participantes, questionarios, programas, alertas, usuarios, perguntas, alternativas, dimensoes, grupos])

  const resetDemoState = useCallback(() => {
    const seed = demoDbService.resetState()
    setEmpresas(seed.empresas)
    setParticipantes(seed.participantes)
    setQuestionarios(seed.questionarios)
    setProgramas(normalizeProgramas(seed.programas as any[]))
    setAlertas(seed.alertas)
    setUsuarios(seed.usuarios)
    setPerguntas(seed.perguntas)
    setAlternativas(seed.alternativas)
    setDimensoes(seed.dimensoes)
    setGrupos(seed.grupos)
  }, [])

  const validateDemoState = useCallback(() => {
    const currentState: DemoDatabase = {
      empresas,
      participantes,
      questionarios,
      programas,
      alertas,
      usuarios,
      perguntas,
      alternativas,
      dimensoes,
      grupos,
      estatisticas: demoDbService.getState().estatisticas,
      evolucao: demoDbService.getState().evolucao,
    }
    return demoDbService.validateState(currentState)
  }, [empresas, participantes, questionarios, programas, alertas, usuarios, perguntas, alternativas, dimensoes, grupos])

  // Empresas
  const addEmpresa = useCallback((empresa: any) => {
    const newId = Math.max(...empresas.map(e => e.id), 0) + 1
    setEmpresas(prev => [...prev, {
      ...empresa,
      id: newId,
      status: empresa.status || 'ativo',
      dataCadastro: empresa.dataCadastro || new Date().toISOString().split('T')[0],
    }])
  }, [empresas])

  const updateEmpresa = useCallback((id: number, data: any) => {
    setEmpresas(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
  }, [])

  const deleteEmpresa = useCallback((id: number) => {
    setEmpresas(prev => prev.filter(e => e.id !== id))
  }, [])

  // Participantes
  const addParticipante = useCallback((participante: any) => {
    const newId = Math.max(...participantes.map(p => p.id), 0) + 1
    setParticipantes(prev => [...prev, { ...participante, id: newId }])
  }, [participantes])

  const updateParticipante = useCallback((id: number, data: any) => {
    setParticipantes(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }, [])

  const deleteParticipante = useCallback((id: number) => {
    setParticipantes(prev => prev.filter(p => p.id !== id))
  }, [])

  // QuestionÃ¡rios
  const addQuestionario = useCallback((questionario: any) => {
    const newId = Math.max(...questionarios.map(q => q.id), 0) + 1
    setQuestionarios(prev => [...prev, { 
      ...questionario, 
      id: newId, 
      status: 'ativo',
      aplicacoesTotal: 0,
      aplicacoesUltimoMes: 0
    }])
  }, [questionarios])

  const updateQuestionario = useCallback((id: number, data: any) => {
    setQuestionarios(prev => prev.map(q => q.id === id ? { ...q, ...data } : q))
  }, [])

  const deleteQuestionario = useCallback((id: number) => {
    setQuestionarios(prev => prev.filter(q => q.id !== id))
    // TambÃ©m remove perguntas, alternativas, dimensÃµes e grupos associados
    setPerguntas(prev => prev.filter(p => p.id_questionario !== id))
    setAlternativas(prev => prev.filter(a => a.id_questionario !== id))
    setDimensoes(prev => prev.filter(d => d.id_questionario !== id))
    setGrupos(prev => prev.filter(g => g.id_questionario !== id))
    setProgramas(prev => prev.map((programa: any) => ({
      ...programa,
      questionariosVinculados: (programa.questionariosVinculados || []).filter((vinculo: any) => vinculo.questionarioId !== id),
    })))
  }, [])

  const duplicarQuestionario = useCallback((id: number) => {
    const sourceQuestionario = questionarios.find((questionario) => questionario.id === id)
    if (!sourceQuestionario) return

    const now = new Date().toISOString()
    const newQuestionarioId = nextNumericId(questionarios as Array<{ id: number }>)

    const sourceDimensoes = dimensoes.filter((dimensao: any) => dimensao.id_questionario === id)
    const sourceGrupos = grupos.filter((grupo: any) => grupo.id_questionario === id)
    const sourcePerguntas = perguntas.filter((pergunta: any) => pergunta.id_questionario === id)
    const sourceAlternativas = alternativas.filter((alternativa: any) => alternativa.id_questionario === id)

    const dimensaoIdMap = new Map<number, number>()
    const grupoIdMap = new Map<number, number>()
    const perguntaIdMap = new Map<number, number>()

    let nextDimensaoId = nextNumericId(dimensoes as Array<{ id: number }>)
    const duplicadasDimensoes = sourceDimensoes.map((dimensao: any) => {
      const newId = nextDimensaoId++
      dimensaoIdMap.set(dimensao.id, newId)
      return {
        ...dimensao,
        id: newId,
        id_questionario: newQuestionarioId,
      }
    })

    let nextGrupoId = nextNumericId(grupos as Array<{ id: number }>)
    const duplicadosGrupos = sourceGrupos.map((grupo: any) => {
      const newId = nextGrupoId++
      grupoIdMap.set(grupo.id, newId)
      return {
        ...grupo,
        id: newId,
        id_questionario: newQuestionarioId,
        id_dimensao: grupo.id_dimensao ? dimensaoIdMap.get(grupo.id_dimensao) || grupo.id_dimensao : grupo.id_dimensao,
      }
    })

    let nextPerguntaId = nextNumericId(perguntas as Array<{ id: number }>)
    sourcePerguntas.forEach((pergunta: any) => {
      perguntaIdMap.set(pergunta.id, nextPerguntaId++)
    })
    const duplicadasPerguntas = sourcePerguntas.map((pergunta: any) => ({
      ...pergunta,
      id: perguntaIdMap.get(pergunta.id),
      id_questionario: newQuestionarioId,
      id_clonagem: pergunta.id,
      id_dependente: pergunta.id_dependente ? perguntaIdMap.get(pergunta.id_dependente) || pergunta.id_dependente : pergunta.id_dependente,
      created_at: now,
      updated_at: now,
    }))

    let nextAlternativaId = nextNumericId(alternativas as Array<{ id: number }>)
    const duplicadasAlternativas = sourceAlternativas.map((alternativa: any) => ({
      ...alternativa,
      id: nextAlternativaId++,
      id_questionario: newQuestionarioId,
      id_pergunta: perguntaIdMap.get(alternativa.id_pergunta) || alternativa.id_pergunta,
      created_at: now,
      updated_at: now,
    }))

    setQuestionarios((prev) => [
      ...prev,
      {
        ...sourceQuestionario,
        id: newQuestionarioId,
        codigo: `${sourceQuestionario.codigo} (Copia)`,
        nome: `${sourceQuestionario.nome} (Copia)`,
        aplicacoesTotal: 0,
        aplicacoesUltimoMes: 0,
      },
    ])
    setDimensoes((prev) => [...prev, ...duplicadasDimensoes])
    setGrupos((prev) => [...prev, ...duplicadosGrupos])
    setPerguntas((prev) => [...prev, ...duplicadasPerguntas])
    setAlternativas((prev) => [...prev, ...duplicadasAlternativas])
  }, [questionarios, dimensoes, grupos, perguntas, alternativas])

  const reorderQuestionarios = useCallback((newOrder: number[]) => {
    const reordered = newOrder.map(id => questionarios.find(q => q.id === id)).filter(Boolean)
    setQuestionarios(reordered as any[])
  }, [questionarios])

  // Programas
  const addPrograma = useCallback((programa: any) => {
    const newId = Math.max(...programas.map((p: any) => p.id), 0) + 1
    setProgramas(prev => [...prev, {
      ...programa,
      id: newId,
      status: programa.status || 'ativo',
      questionariosVinculados: programa.questionariosVinculados || [],
      empresasVinculadas: programa.empresasVinculadas || [],
    }])
  }, [programas])
  const getProgramaQuestionarios = useCallback((programaId: number) => {
    const programa = programas.find((p: any) => p.id === programaId) as any
    return (programa?.questionariosVinculados || []).sort((a: any, b: any) => Number(a.ordem || 0) - Number(b.ordem || 0))
  }, [programas])

  const setProgramaQuestionarios = useCallback((programaId: number, vinculos: DemoProgramaQuestionarioVinculo[]) => {
    setProgramas(prev => prev.map((p: any) => {
      if (p.id !== programaId) return p
      return {
        ...p,
        questionariosVinculados: vinculos
          .slice()
          .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
          .map((v, index) => ({ ...v, ordem: index + 1 })),
      }
    }))
  }, [])

  const getProgramaEmpresas = useCallback((programaId: number) => {
    const programa = programas.find((p: any) => p.id === programaId) as any
    return (programa?.empresasVinculadas || []) as DemoProgramaEmpresaVinculo[]
  }, [programas])

  const vincularEmpresaPrograma = useCallback((programaId: number, empresaId: number) => {
    const now = new Date().toISOString()
    setProgramas((prev) =>
      prev.map((programa: any) => {
        if (programa.id !== programaId) return programa

        const vinculos = (programa.empresasVinculadas || []) as DemoProgramaEmpresaVinculo[]
        if (vinculos.some((v) => v.empresaId === empresaId)) return programa

        const novoVinculo: DemoProgramaEmpresaVinculo = {
          id: Date.now(),
          empresaId,
          intervaloInicio: null,
          intervaloFim: null,
          indeterminado: true,
          acessoPublicoAtivo: false,
          usuariosPermitidos: [],
          createdAt: now,
          updatedAt: now,
        }

        return {
          ...programa,
          empresasVinculadas: [...vinculos, novoVinculo],
        }
      })
    )
  }, [])

  const removerEmpresaPrograma = useCallback((programaId: number, vinculoId: number) => {
    setProgramas((prev) =>
      prev.map((programa: any) => {
        if (programa.id !== programaId) return programa
        return {
          ...programa,
          empresasVinculadas: (programa.empresasVinculadas || []).filter((v: any) => v.id !== vinculoId),
        }
      })
    )
  }, [])

  const atualizarIntervaloEmpresaPrograma = useCallback((
    programaId: number,
    vinculoId: number,
    payload: { intervaloInicio?: string | null; intervaloFim?: string | null; indeterminado?: boolean }
  ) => {
    const now = new Date().toISOString()
    setProgramas((prev) =>
      prev.map((programa: any) => {
        if (programa.id !== programaId) return programa
        return {
          ...programa,
          empresasVinculadas: (programa.empresasVinculadas || []).map((v: any) => (
            v.id === vinculoId
              ? {
                ...v,
                ...payload,
                updatedAt: now,
              }
              : v
          )),
        }
      })
    )
  }, [])

  const atualizarUsuariosPermitidosPrograma = useCallback((programaId: number, vinculoId: number, userIds: number[]) => {
    const now = new Date().toISOString()
    setProgramas((prev) =>
      prev.map((programa: any) => {
        if (programa.id !== programaId) return programa
        return {
          ...programa,
          empresasVinculadas: (programa.empresasVinculadas || []).map((v: any) => (
            v.id === vinculoId
              ? {
                ...v,
                usuariosPermitidos: Array.from(new Set(userIds.map((id) => Number(id)))),
                updatedAt: now,
              }
              : v
          )),
        }
      })
    )
  }, [])

  const toggleAcessoPublicoPrograma = useCallback((programaId: number, vinculoId: number) => {
    const now = new Date().toISOString()
    setProgramas((prev) =>
      prev.map((programa: any) => {
        if (programa.id !== programaId) return programa
        return {
          ...programa,
          empresasVinculadas: (programa.empresasVinculadas || []).map((v: any) => (
            v.id === vinculoId
              ? { ...v, acessoPublicoAtivo: !v.acessoPublicoAtivo, updatedAt: now }
              : v
          )),
        }
      })
    )
  }, [])

  const updatePrograma = useCallback((id: number, data: any) => {
    setProgramas(prev => prev.map((p: any) => p.id === id ? { ...p, ...data } : p))
  }, [])

  const deletePrograma = useCallback((id: number) => {
    setProgramas(prev => prev.filter((p: any) => p.id !== id))
  }, [])

  const duplicarPrograma = useCallback((id: number) => {
    const programa = programas.find((p: any) => p.id === id) as any
    if (programa) {
      const newId = Math.max(...programas.map((p: any) => p.id), 0) + 1
      let nextVinculoId = Date.now()
      setProgramas(prev => [...prev, {
        ...programa,
        id: newId,
        nome: `${programa.nome} (CÃ³pia)`,
        status: 'ativo',
        questionariosVinculados: (programa.questionariosVinculados || []).map((vinculo: any, index: number) => ({
          ...vinculo,
          id: nextVinculoId + index,
        })),
        empresasVinculadas: (programa.empresasVinculadas || []).map((vinculo: any, index: number) => ({
          ...vinculo,
          id: nextVinculoId + 1000 + index,
          usuariosPermitidos: [...(vinculo.usuariosPermitidos || [])],
          updatedAt: new Date().toISOString(),
        })),
      }])
    }
  }, [programas])
  // UsuÃ¡rios
  const addUsuario = useCallback((usuario: any) => {
    const newId = Math.max(...usuarios.map((u: any) => u.id), 0) + 1
    const loginBase = String(usuario.login || usuario.nome || usuario.email || `usuario${newId}`)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '.')
    setUsuarios(prev => [...prev, { 
      ...usuario, 
      id: newId,
      login: loginBase,
      dataCadastro: new Date().toISOString().split('T')[0],
      ultimoAcesso: new Date().toISOString()
    }])
  }, [usuarios])

  const updateUsuario = useCallback((id: number, data: any) => {
    setUsuarios(prev => prev.map((u: any) => u.id === id ? { ...u, ...data } : u))
  }, [])

  const deleteUsuario = useCallback((id: number) => {
    setUsuarios(prev => prev.filter((u: any) => u.id !== id))
  }, [])

  const duplicarUsuario = useCallback((id: number) => {
    const usuario = usuarios.find((u: any) => u.id === id)
    if (usuario) {
      const usuarioAtual = usuario as any
      const newId = Math.max(...usuarios.map((u: any) => u.id), 0) + 1
      const emailCopia = usuarioAtual.email ? `copia_${usuarioAtual.email}` : `copia_${usuarioAtual.login || `usuario${newId}`}@demo.local`
      const loginCopia = `copia_${usuarioAtual.login || usuarioAtual.nome || `usuario${newId}`}`
      setUsuarios(prev => [...prev, {
        ...usuarioAtual,
        id: newId,
        nome: `${usuarioAtual.nome} (CÃ³pia)`,
        email: emailCopia,
        login: loginCopia,
        dataCadastro: new Date().toISOString().split('T')[0],
        ultimoAcesso: new Date().toISOString()
      }])
    }
  }, [usuarios])

  // Perguntas
  const addPergunta = useCallback((pergunta: any) => {
    const newId = Math.max(...perguntas.map(p => p.id), 0) + 1
    setPerguntas(prev => [...prev, { 
      ...pergunta, 
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
  }, [perguntas])

  const updatePergunta = useCallback((id: number, data: any) => {
    setPerguntas(prev => prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p))
  }, [])

  const deletePergunta = useCallback((id: number) => {
    setPerguntas(prev => prev.filter(p => p.id !== id))
    // Remove alternativas associadas
    setAlternativas(prev => prev.filter(a => a.id_pergunta !== id))
  }, [])

  const getPerguntasByQuestionario = useCallback((questionarioId: number) => {
    return perguntas.filter(p => p.id_questionario === questionarioId).sort((a, b) => Number(a.pos || 0) - Number(b.pos || 0))
  }, [perguntas])

  const reorderPerguntas = useCallback((questionarioId: number, newOrder: number[]) => {
    setPerguntas(prev => {
      const updated = [...prev]
      newOrder.forEach((id, index) => {
        const perguntaIndex = updated.findIndex(p => p.id === id && p.id_questionario === questionarioId)
        if (perguntaIndex >= 0) {
          updated[perguntaIndex] = { ...updated[perguntaIndex], pos: index + 1 }
        }
      })
      return updated
    })
  }, [])

  // Alternativas
  const addAlternativa = useCallback((alternativa: any) => {
    const newId = Math.max(...alternativas.map(a => a.id), 0) + 1
    setAlternativas(prev => [...prev, { 
      ...alternativa, 
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
  }, [alternativas])

  const updateAlternativa = useCallback((id: number, data: any) => {
    setAlternativas(prev => prev.map(a => a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a))
  }, [])

  const deleteAlternativa = useCallback((id: number) => {
    setAlternativas(prev => prev.filter(a => a.id !== id))
  }, [])

  const getAlternativasByPergunta = useCallback((perguntaId: number) => {
    return alternativas.filter(a => a.id_pergunta === perguntaId)
  }, [alternativas])

  // DimensÃµes
  const addDimensao = useCallback((dimensao: any) => {
    const newId = Math.max(...dimensoes.map(d => d.id), 0) + 1
    setDimensoes(prev => [...prev, { 
      ...dimensao, 
      id: newId
    }])
  }, [dimensoes])

  const updateDimensao = useCallback((id: number, data: any) => {
    setDimensoes(prev => prev.map(d => d.id === id ? { ...d, ...data } : d))
  }, [])

  const deleteDimensao = useCallback((id: number) => {
    setDimensoes(prev => prev.filter(d => d.id !== id))
    // Remove grupos associados
    setGrupos(prev => prev.filter(g => g.id_dimensao !== id))
  }, [])

  const getDimensoesByQuestionario = useCallback((questionarioId: number) => {
    return dimensoes.filter(d => d.id_questionario === questionarioId).sort((a, b) => Number(a.pos || 0) - Number(b.pos || 0))
  }, [dimensoes])

  const reorderDimensoes = useCallback((questionarioId: number, newOrder: number[]) => {
    setDimensoes(prev => {
      const updated = [...prev]
      newOrder.forEach((id, index) => {
        const dimensaoIndex = updated.findIndex(d => d.id === id && d.id_questionario === questionarioId)
        if (dimensaoIndex >= 0) {
          updated[dimensaoIndex] = { ...updated[dimensaoIndex], pos: index + 1 }
        }
      })
      return updated
    })
  }, [])

  // Grupos
  const addGrupo = useCallback((grupo: any) => {
    const newId = Math.max(...grupos.map(g => g.id), 0) + 1
    setGrupos(prev => [...prev, { 
      ...grupo, 
      id: newId
    }])
  }, [grupos])

  const updateGrupo = useCallback((id: number, data: any) => {
    setGrupos(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  }, [])

  const deleteGrupo = useCallback((id: number) => {
    setGrupos(prev => prev.filter(g => g.id !== id))
  }, [])

  const getGruposByDimensao = useCallback((dimensaoId: number) => {
    return grupos.filter(g => g.id_dimensao === dimensaoId).sort((a, b) => Number(a.pos || 0) - Number(b.pos || 0))
  }, [grupos])

  const getGruposByQuestionario = useCallback((questionarioId: number) => {
    return grupos.filter(g => g.id_questionario === questionarioId).sort((a, b) => Number(a.pos || 0) - Number(b.pos || 0))
  }, [grupos])

  const reorderGrupos = useCallback((dimensaoId: number, newOrder: number[]) => {
    setGrupos(prev => {
      const updated = [...prev]
      newOrder.forEach((id, index) => {
        const grupoIndex = updated.findIndex(g => g.id === id && g.id_dimensao === dimensaoId)
        if (grupoIndex >= 0) {
          updated[grupoIndex] = { ...updated[grupoIndex], pos: index + 1 }
        }
      })
      return updated
    })
  }, [])

  // Salvar ordem completa (hierarquia)
  const salvarOrdemQuestionario = useCallback((questionarioId: number, estrutura: any[]) => {
    // Atualiza dimensÃµes, grupos e perguntas com base na estrutura hierÃ¡rquica
    estrutura.forEach((dimensao, dimIndex) => {
      updateDimensao(dimensao.id, {
        dimensao_pos: dimIndex + 1,
        nome: dimensao.nome
      })
      
      dimensao.grupos?.forEach((grupo: any, grpIndex: number) => {
        updateGrupo(grupo.id, {
          grupo_pos: grpIndex + 1,
          nome: grupo.nome,
          dimensao_pos: dimIndex + 1
        })
        
        grupo.perguntas?.forEach((pergunta: any, perIndex: number) => {
          updatePergunta(pergunta.id, {
            pos: perIndex + 1,
            dimensao_nome: dimensao.nome,
            dimensao_pos: dimIndex + 1,
            grupo_nome: grupo.nome,
            grupo_pos: grpIndex + 1
          })
        })
      })
    })
  }, [updateDimensao, updateGrupo, updatePergunta])

  return (
    <DemoContext.Provider value={{
      empresas,
      participantes,
      questionarios,
      programas,
      alertas,
      usuarios,
      perguntas,
      alternativas,
      dimensoes,
      grupos,
      addEmpresa,
      updateEmpresa,
      deleteEmpresa,
      addParticipante,
      updateParticipante,
      deleteParticipante,
      addQuestionario,
      updateQuestionario,
      deleteQuestionario,
      duplicarQuestionario,
      reorderQuestionarios,
      addPrograma,
      updatePrograma,
      deletePrograma,
      duplicarPrograma,
      getProgramaQuestionarios,
      setProgramaQuestionarios,
      getProgramaEmpresas,
      vincularEmpresaPrograma,
      removerEmpresaPrograma,
      atualizarIntervaloEmpresaPrograma,
      atualizarUsuariosPermitidosPrograma,
      toggleAcessoPublicoPrograma,
      addUsuario,
      updateUsuario,
      deleteUsuario,
      duplicarUsuario,
      addPergunta,
      updatePergunta,
      deletePergunta,
      getPerguntasByQuestionario,
      reorderPerguntas,
      addAlternativa,
      updateAlternativa,
      deleteAlternativa,
      getAlternativasByPergunta,
      addDimensao,
      updateDimensao,
      deleteDimensao,
      getDimensoesByQuestionario,
      reorderDimensoes,
      addGrupo,
      updateGrupo,
      deleteGrupo,
      getGruposByDimensao,
      getGruposByQuestionario,
      reorderGrupos,
      salvarOrdemQuestionario,
      resetDemoState,
      validateDemoState,
    }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider')
  }
  return context
}

