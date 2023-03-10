const isServer = 'undefined' === typeof window
const isBrowser = !isServer
const isServerDeploy = !!process.env.NEXT_PUBLIC_SERVER
const isTestServer = process.env.NEXT_PUBLIC_ENV === 'test'

const backend = isTestServer ? 'https://name3.net/api' : 'https://name3.net/api'

export const ENV = {
  isServer,
  isBrowser,
  backend,
  isServerDeploy,
  isTestServer,
}
