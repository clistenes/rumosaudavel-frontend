'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { 
  EMPRESAS_DEMO, 
  PARTICIPANTES_DEMO, 
  QUESTIONARIOS_DEMO, 
  PROGRAMAS_DEMO,
  ALERTAS_DEMO,
  USUARIOS_DEMO,
  PERGUNTAS_DEMO,
  ALTERNATIVAS_DEMO,
  DIMENSOES_DEMO,
  GRUPOS_DEMO
} from '@/assets/data/demo-data'

interface DemoContextType {
  // Dados
  empresas: typeof EMPRESAS_DEMO
  participantes: typeof PARTICIPANTES_DEMO
  questionarios: typeof QUESTIONARIOS_DEMO
  programas: typeof PROGRAMAS_DEMO
  alertas: typeof ALERTAS_DEMO
  usuarios: typeof USUARIOS_DEMO
  perguntas: typeof PERGUNTAS_DEMO
  alternativas: typeof ALTERNATIVAS_DEMO
  dimensoes: typeof DIMENSOES_DEMO
  grupos: typeof GRUPOS_DEMO
  
  // Actions Empresas
  addEmpresa: (empresa: any) => void
  updateEmpresa: (id: number, data: any) => void
  deleteEmpresa: (id: number) => void
  
  // Actions Participantes
  addParticipante: (participante: any) => void
  updateParticipante: (id: number, data: any) => void
  deleteParticipante: (id: number) => void
  
  // Actions Questionários
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
  
  // Actions Usuários
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
  
  // Actions Dimensões
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
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [empresas, setEmpresas] = useState([...EMPRESAS_DEMO])
  const [participantes, setParticipantes] = useState([...PARTICIPANTES_DEMO])
  const [questionarios, setQuestionarios] = useState([...QUESTIONARIOS_DEMO])
  const [programas, setProgramas] = useState([...PROGRAMAS_DEMO])
  const [alertas, setAlertas] = useState([...ALERTAS_DEMO])
  const [usuarios, setUsuarios] = useState([...USUARIOS_DEMO])
  const [perguntas, setPerguntas] = useState([...PERGUNTAS_DEMO])
  const [alternativas, setAlternativas] = useState([...ALTERNATIVAS_DEMO])
  const [dimensoes, setDimensoes] = useState([...DIMENSOES_DEMO])
  const [grupos, setGrupos] = useState([...GRUPOS_DEMO])

  // Empresas
  const addEmpresa = useCallback((empresa: any) => {
    const newId = Math.max(...empresas.map(e => e.id), 0) + 1
    setEmpresas(prev => [...prev, { ...empresa, id: newId, dataCadastro: new Date().toISOString().split('T')[0] }])
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

  // Questionários
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
    // Também remove perguntas, alternativas, dimensões e grupos associados
    setPerguntas(prev => prev.filter(p => p.id_questionario !== id))
    setAlternativas(prev => prev.filter(a => a.id_questionario !== id))
    setDimensoes(prev => prev.filter(d => d.id_questionario !== id))
    setGrupos(prev => prev.filter(g => g.id_questionario !== id))
  }, [])

  const duplicarQuestionario = useCallback((id: number) => {
    const q = questionarios.find(q => q.id === id)
    if (q) {
      const newId = Math.max(...questionarios.map(q => q.id), 0) + 1
      setQuestionarios(prev => [...prev, {
        ...q,
        id: newId,
        codigo: `${q.codigo} (Cópia)`,
        nome: `${q.nome} (Cópia)`,
        aplicacoesTotal: 0,
        aplicacoesUltimoMes: 0
      }])
      
      // Duplicar perguntas
      const perguntasQ = perguntas.filter(p => p.id_questionario === id)
      perguntasQ.forEach(pergunta => {
        const newPerguntaId = Math.max(...perguntas.map(p => p.id), 0) + 1
        setPerguntas(prev => [...prev, {
          ...(pergunta as any),
          id: newPerguntaId,
          id_questionario: newId,
          id_clonagem: pergunta.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      })
    }
  }, [questionarios, perguntas])

  const reorderQuestionarios = useCallback((newOrder: number[]) => {
    const reordered = newOrder.map(id => questionarios.find(q => q.id === id)).filter(Boolean)
    setQuestionarios(reordered as any[])
  }, [questionarios])

  // Programas
  const addPrograma = useCallback((programa: any) => {
    const newId = Math.max(...programas.map((p: any) => p.id), 0) + 1
    setProgramas(prev => [...prev, { ...programa, id: newId }])
  }, [programas])

  const updatePrograma = useCallback((id: number, data: any) => {
    setProgramas(prev => prev.map((p: any) => p.id === id ? { ...p, ...data } : p))
  }, [])

  const deletePrograma = useCallback((id: number) => {
    setProgramas(prev => prev.filter((p: any) => p.id !== id))
  }, [])

  const duplicarPrograma = useCallback((id: number) => {
    const programa = programas.find((p: any) => p.id === id)
    if (programa) {
      const newId = Math.max(...programas.map((p: any) => p.id), 0) + 1
      setProgramas(prev => [...prev, {
        ...programa,
        id: newId,
        nome: `${programa.nome} (Cópia)`,
        status: 'ativo'
      }])
    }
  }, [programas])

  // Usuários
  const addUsuario = useCallback((usuario: any) => {
    const newId = Math.max(...usuarios.map((u: any) => u.id), 0) + 1
    setUsuarios(prev => [...prev, { 
      ...usuario, 
      id: newId,
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
      const newId = Math.max(...usuarios.map((u: any) => u.id), 0) + 1
      setUsuarios(prev => [...prev, {
        ...usuario,
        id: newId,
        nome: `${usuario.nome} (Cópia)`,
        email: `copia_${usuario.email}`,
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
    return perguntas.filter(p => p.id_questionario === questionarioId).sort((a, b) => a.pos - b.pos)
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

  // Dimensões
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
    return dimensoes.filter(d => d.id_questionario === questionarioId).sort((a, b) => a.pos - b.pos)
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
    return grupos.filter(g => g.id_dimensao === dimensaoId).sort((a, b) => a.pos - b.pos)
  }, [grupos])

  const getGruposByQuestionario = useCallback((questionarioId: number) => {
    return grupos.filter(g => g.id_questionario === questionarioId).sort((a, b) => a.pos - b.pos)
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
    // Atualiza dimensões, grupos e perguntas com base na estrutura hierárquica
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
