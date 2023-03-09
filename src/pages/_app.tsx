import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../views/layout'
import useRouteProgress from '@/hooks/useRouteProgress'

export default function App({ Component, pageProps }: AppProps) {
    useRouteProgress()
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
