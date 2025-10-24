import type { Metadata } from 'next'
import AllNavBars from './components/AllNavBars'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Navbars' }

const Navbar = () => {
  return (
    <>
    <PageTitle title='Navbar' subName='UI Ki' />
    <AllNavBars />
    </>
    )
}

export default Navbar
