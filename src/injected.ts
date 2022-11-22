import {
  ActionResponse,
  DispatchActionResponse,
  DISPATCH_REQUEST,
  DISPATCH_RESULT,
  EthereumRequest,
  Transaction,
} from './types/messaging'
import { getLogger } from './utils/logger'

const logger = getLogger('injected')

interface Deferred<T> {
  resolve(res: T): void
  reject(e: Error): void
}

document.addEventListener(DISPATCH_RESULT, (e) => {
  logger.info('got DISPATCH_RESULT event from content script', e)
  const evt = e as CustomEvent<DispatchActionResponse>
  const deferred = defferedMap[evt.detail.reqId]
  if (deferred) {
    deferred.resolve(evt.detail)
  }
})

const defferedMap: { [id: string]: Deferred<DispatchActionResponse> } = {}

const requestManager = {
  async request(args: EthereumRequest): Promise<DispatchActionResponse> {
    const reqId = `${Date.now()}_${Math.round(Math.random() * 1000)}`
    document.dispatchEvent(
      new CustomEvent(DISPATCH_REQUEST, {
        detail: {
          reqId,
          request: args,
        },
      }),
    )
    const deferred = {} as Deferred<DispatchActionResponse>
    const promise = new Promise<DispatchActionResponse>((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    defferedMap[reqId] = deferred
    return promise
  },
}

const proxyHandler = {
  get(target: any, prop: any, receiver: any) {
    const originalCall = Reflect.get(target, prop, receiver)
    if (prop !== 'request' && prop !== 'send' && prop !== 'sendAsync') {
      return originalCall
    }
    // avoid double hook
    if (originalCall._tutumHooked) {
      return originalCall
    }

    const func = async (...args: any) => {
      const requestArg = args[0]
      logger.debug('handle ethereum call', prop, requestArg)

      if (requestArg.method === 'eth_sendTransaction') {
        // { method: string; params: [Transaction] }
        const transaction = requestArg.params[0] as Transaction
        const response = await requestManager.request({
          refUrl: window.location.href,
          chainId: await target.request({ method: 'eth_chainId' }),
          transaction,
        })
        logger.debug('User action', response)
        if (response.action == ActionResponse.Reject) {
          throw new Error('User rejected tx')
        }
      } else if (requestArg.method === 'eth_sign') {
        const response = await requestManager.request({
          refUrl: window.location.href,
          chainId: await target.request({ method: 'eth_chainId' }),
          method: requestArg.method,
          params: requestArg.params,
        })
        logger.debug('User action', response)
        if (response.action == ActionResponse.Reject) {
          throw new Error('User rejected tx')
        }
      }
      return originalCall(...args)
    }

    func._tutumHooked = true
    return func
  },
}

declare global {
  interface Window {
    ethereum?: any
  }
}

logger.info('tutum hooking ethereum')

let cachedProxy: any
let providerChanged = true
let originProvider = window.ethereum

Object.defineProperty(window, 'ethereum', {
  get() {
    if (!originProvider) {
      return
    }
    if (providerChanged) {
      const proxy = new Proxy(originProvider, proxyHandler)
      proxy._hooked = true
      cachedProxy = proxy
      providerChanged = false
    }
    return cachedProxy
  },
  set(newProvider) {
    originProvider = newProvider
    providerChanged = true
  },
  configurable: true,
})
