import type { Metadata } from 'next'
import ProjectList from './components/ProjectList'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Dragula' }

const Dragula = () => {
  return(
    <>
   <PageTitle title='Dragula' subName='Advanced UI' /> 
    <ProjectList />
    </>
  )
}

export default Dragula
