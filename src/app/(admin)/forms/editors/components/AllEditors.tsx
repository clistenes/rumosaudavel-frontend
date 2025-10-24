'use client'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import ReactQuill from 'react-quill-new'

import 'react-quill-new/dist/quill.snow.css'

const AllEditors = () => {
  const snowValue = `<p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br /></p>`
  return (
    <ComponentContainerCard title="Quill Editor">
      <ReactQuill theme="snow" value={snowValue} />
    </ComponentContainerCard>
  )
}

export default AllEditors
