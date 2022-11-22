import ky from 'ky'
import config from '../config'
import { CheckResponse, EthereumSignRequest, EthereumTransactionRequest } from '../types/messaging'
import { SimulationResult } from '../types/simulation'
import { getExtensionVersion } from '../utils'

const client = ky.create({
  prefixUrl: config.serverHost,
  timeout: 30 * 1000,
  headers: {
    'x-app-version': getExtensionVersion(),
  },
})

async function checkTransaction(request: EthereumTransactionRequest): Promise<CheckResponse> {
  return client.post('api/check-transaction', { json: request }).json()
}

async function checkSign(request: EthereumSignRequest): Promise<CheckResponse> {
  return client.post('api/check-sign', { json: request }).json()
}

async function checkSimulation(request: EthereumTransactionRequest): Promise<SimulationResult> {
  const data: SimulationResult = await client.post('api/simulate', { json: request }).json()
  if (data.success) {
    return data
  }
  throw new Error(data.error)
}

export { checkTransaction, checkSign, checkSimulation }
