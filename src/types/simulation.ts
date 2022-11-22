import { CheckWarning } from './messaging'

export enum EventType {
  TransferIn = 'TransferIn',
  TransferOut = 'TransferOut',
}

export enum TokenType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  ERC20 = 'ERC20',
}

export interface Event {
  type: EventType
  tokenType: TokenType
  contractAddress: string
  name: string
  image?: string
  amount: string
  decimals?: number
  verified?: boolean
  desc?: string
}

export interface Simulation {
  events: Event[]
}

export type SimulationResult =
  | {
      success: true
      simulation: Simulation
      warnings?: CheckWarning[]
    }
  | {
      success: false
      error: string
      warnings?: CheckWarning[]
    }
