'use client'
import { useEffect, type ReactNode } from 'react'
import Prism from 'prismjs'

import 'prismjs/themes/prism-okaidia.css'

const HighlightCode = ({ code, language }: { code: ReactNode; language: string }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])
  return (
    <pre className={`rounded language-${language}`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  )
}

export default HighlightCode
