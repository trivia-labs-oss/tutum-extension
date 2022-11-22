interface Config {
  logLevel: 'debug' | 'info'
  serverHost: string
}

let config: Config = {
  logLevel: 'info',
  serverHost: 'https://tutum.0x.watch',
}

if (process.env.NODE_ENV === 'development') {
  config = {
    logLevel: 'debug',
    serverHost: 'http://localhost:3000',
  }
}

export default config
