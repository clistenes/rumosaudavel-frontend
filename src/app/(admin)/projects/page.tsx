import PageTitle from '@/components/PageTitle'
import React from 'react'
import Projects from './components/Projects'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

const ProjectsPage = () => {
  return (
    <>
      <PageTitle title='Projects' subName='Projects' />
      <Projects />
    </>
  )
}

export default ProjectsPage