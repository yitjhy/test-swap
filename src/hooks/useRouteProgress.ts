import { useRouter } from 'next/router'
import { useEffect } from 'react'
import NProgress from 'nprogress'

export default function useRouteProgress() {
  const router = useRouter()
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      NProgress.start()
    })
    router.events.on('routeChangeComplete', () => {
      NProgress.done()
    })
    router.events.on('routeChangeError', () => {
      NProgress.done()
    })
  }, [])
}
