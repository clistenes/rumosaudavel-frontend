import type { MenuItemType } from '@/types/menu'

// Menu para Administrador (type 1)
export const MENU_ITEMS_ADMIN: MenuItemType[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'iconoir:home-simple',
    url: '/inicio',
  },
  {
    key: 'programas',
    label: 'Programas',
    icon: 'iconoir:suitcase',
    children: [
      {
        key: 'novo-programa',
        label: 'Novo Programa',
        url: '/programas/novo-programa',
        parentKey: 'programas',
      },
      {
        key: 'todos-programas',
        label: 'Todos Programas',
        url: '/programas/todos-programas',
        parentKey: 'programas',
      },
    ]
  },
  {
    key: 'sair',
    icon: 'la:power-off',
    label: 'Sair',
    url: '/auth/logout',
  },
]

// Menu para Participante (type 2)
export const MENU_ITEMS_PARTICIPANTE: MenuItemType[] = [
  {
    key: 'dashboard',
    label: 'Início',
    icon: 'iconoir:home-simple',
    url: '/participante',
  },
  {
    key: 'questionarios',
    label: 'Meus Questionários',
    icon: 'iconoir:paste-clipboard',
    url: '/participante/questionarios',
  },
  {
    key: 'prontuario',
    label: 'Meu Prontuário',
    icon: 'iconoir:health-shield',
    url: '/participante/prontuario',
  },
  {
    key: 'contatos',
    label: 'Contatos',
    icon: 'iconoir:community',
    url: '/participante/contatos',
  },
  {
    key: 'sair',
    icon: 'la:power-off',
    label: 'Sair',
    url: '/auth/logout',
  },
]

// Menu para Empresa (type 3)
export const MENU_ITEMS_EMPRESA: MenuItemType[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'iconoir:home-simple',
    url: '/empresa',
  },
  {
    key: 'participantes',
    label: 'Participantes',
    icon: 'iconoir:community',
    url: '/empresa/participantes',
  },
  {
    key: 'relatorios',
    label: 'Relatórios',
    icon: 'iconoir:report-columns',
    children: [
      {
        key: 'relatorio-geral',
        label: 'Relatório Geral',
        url: '/empresa/relatorios/geral',
        parentKey: 'relatorios',
      },
      {
        key: 'relatorio-grafico',
        label: 'Gráficos',
        url: '/empresa/relatorios/graficos',
        parentKey: 'relatorios',
      },
      {
        key: 'relatorio-semaforo',
        label: 'Semáforo',
        url: '/empresa/relatorios/semaforo',
        parentKey: 'relatorios',
      },
      {
        key: 'relatorio-heatmap',
        label: 'Heatmap',
        url: '/empresa/relatorios/heatmap',
        parentKey: 'relatorios',
      },
    ]
  },
  {
    key: 'sair',
    icon: 'la:power-off',
    label: 'Sair',
    url: '/auth/logout',
  },
]

// Menu default (mantido para compatibilidade)
export const MENU_ITEMS = MENU_ITEMS_ADMIN
