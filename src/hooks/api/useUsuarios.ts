/**
 * Hooks especificos para Usuarios
 */

import { useCallback } from 'react'
import { usuarioService, type ListarUsuariosParams, type CriarUsuarioData } from '@/services'
import { useFetch, useMutation, usePaginatedFetch } from './useFetch'

export function useUsuarios(params: ListarUsuariosParams = {}) {
  return usePaginatedFetch((page, perPage) =>
    usuarioService.listar({ ...params, page, perPage })
  )
}

export function useUsuario(id: number | null) {
  const fetchFn = useCallback(() => {
    if (!id) throw new Error('ID nao fornecido')
    return usuarioService.buscarPorId(id)
  }, [id])

  return useFetch(fetchFn, !!id)
}

export function useCriarUsuario() {
  return useMutation((data: CriarUsuarioData) => usuarioService.criar(data))
}

export function useAtualizarUsuario() {
  return useMutation(({ id, data }: { id: number; data: Partial<CriarUsuarioData> }) =>
    usuarioService.atualizar(id, data)
  )
}

export function useRemoverUsuario() {
  return useMutation((id: number) => usuarioService.remover(id))
}
