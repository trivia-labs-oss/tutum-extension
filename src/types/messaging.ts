import { SimulationResult } from './simulation'

export const STORAGE_KEY = 'scam.watch.storage'
export const DISPATCH_REQUEST = 'DISPATCH_REQUEST'
export const DISPATCH_RESULT = 'DISPATCH_RESULT'

export interface Transaction {
  from: string
  to: string
  value?: string
  data?: string
  gas?: string
}

export type EthereumTransactionRequest = {
  chainId: string
  refUrl?: string
  transaction: Transaction
}

export type EthereumSignRequest = {
  chainId: string
  refUrl?: string
  method: string
  params: any[]
}

export type EthereumRequest = EthereumTransactionRequest | EthereumSignRequest

// dispatch message
export interface DispatchRequest {
  reqId: string
  request: EthereumRequest
}

export enum ActionResponse {
  Pass,
  Reject,
  Skip,
}

export interface DispatchActionResponse {
  reqId: string
  action: ActionResponse
}

// browser.runtime.Message
export enum MessageType {
  TransactionRequest,
  UserAction,
}

export interface MessageRequest {
  type: MessageType.TransactionRequest
  data: DispatchRequest
}

export interface MessageUserAction {
  type: MessageType.UserAction
  reqId: string
  action: ActionResponse
}

// storage.local message
export interface CheckResult {
  reqId: string
  tabId?: number
  msg?: string
  toAddressInfo?: AddressInfo
  simulation?: SimulationResult
  warnings?: CheckWarning[]
}

// api message
export type CheckWarning = ApproveWarning | DomainCheckWarning | TextWarning

export interface ApproveWarning {
  type: 'approve'
  asset: AddressInfo
  operator: AddressInfo
  isSafeOperator?: boolean
}

export interface DomainCheckWarning {
  type: 'domain'
  dapp: {
    name: string
    website: string
  }
  address: string
  refUrl: string
}

export interface TextWarning {
  type: 'text'
  i18nKey: string
}

export interface AddressInfo {
  address: string
  name?: string
  image?: string
  verified?: boolean
}

export interface CheckResponse {
  toAddressInfo?: AddressInfo
  warnings?: CheckWarning[]
}
