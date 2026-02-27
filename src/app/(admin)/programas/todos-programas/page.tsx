import { redirect } from 'next/navigation'

export const metadata = { title: 'Todos os Programas' }

const TodosProgramas = () => {
  redirect('/adm/lista-programas')
}

export default TodosProgramas
