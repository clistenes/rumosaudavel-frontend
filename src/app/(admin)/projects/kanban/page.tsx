import type { Metadata } from 'next'
import { KanbanProvider } from '@/context/useKanbanContext'
import Board from './components/Board'
import Modals from './components/Modals'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Kanban Board' }

const Kanban = () => {
  return (
    <>
    <PageTitle title='Kanban' subName='Projects' />
    <KanbanProvider>
      <Board />
      <Modals />
    </KanbanProvider>
    </>
  )
}

export default Kanban
