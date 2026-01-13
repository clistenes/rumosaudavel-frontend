import type { AppProps } from 'next/app'

import AdminLayout from '@/components/layouts/AdminLayout'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />

  )
}
