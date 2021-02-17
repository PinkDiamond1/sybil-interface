import { DelegateData } from './hooks'
import { SerializedToken } from './../user/actions'
import { ChainId, Token } from '@uniswap/sdk'
import {
  updateActiveProtocol,
  updateFilterActive,
  updateTopDelegates,
  updateVerifiedDelegates,
  updateGlobalData,
  updateMaxFetched
} from './actions'
import { createReducer } from '@reduxjs/toolkit'
import UniLogo from '../../assets/images/uni-logo.png'
import CompLogo from '../../assets/images/compLogo.png'
import PoolLogo from '../../assets/images/pooltogether-icon.png'
import { serializeToken } from '../user/hooks'

export interface GovernanceInfo {
  id: string
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  token: SerializedToken
  governanceAddress: string
  social: string
  emoji?: string
}

// protocol wide data
export interface GlobaData {
  id: string
  totalTokenHolders: number
  totalDelegates: number
  delegatedVotes: number
  delegatedVotesRaw: number
}

// constant addresses for supported protocols
export const UNI_GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
export const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const UNI = new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')

export const UNISWAP_GOVERNANCE: GovernanceInfo = {
  id: 'uniswap',
  name: 'Uniswap Governance',
  logo: UniLogo,
  primaryColor: '#FF007A',
  secondaryColor: '#FDEEF5',
  token: serializeToken(UNI),
  governanceAddress: UNI_GOVERNANCE_ADDRESS,
  social: '@UniswapProtocol',
  emoji: '🦄'
}

export const COMP_GOVERNANCE_ADDRESS = '0xc0dA01a04C3f3E0be433606045bB7017A7323E38'
export const COMP_ADDRESS = '0xc00e94cb662c3520282e6f5717214004a7f26888'
const COMP = new Token(ChainId.MAINNET, COMP_ADDRESS, 18, 'COMP', 'Compound Governance Token')

export const COMPOUND_GOVERNANCE: GovernanceInfo = {
  id: 'compound',
  name: 'Compound Governance',
  logo: CompLogo,
  primaryColor: '#00D395',
  secondaryColor: '#f0fffa',
  token: serializeToken(COMP),
  governanceAddress: COMP_GOVERNANCE_ADDRESS,
  social: '@compoundfinance',
  emoji: '🏦'
}

export const POOL_TOGETHER_GOVERNANCE_ADDRESS = '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0'
export const POOL_ADDRESS = '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e'
const POOL = new Token(ChainId.MAINNET, POOL_ADDRESS, 18, 'POOL', 'PoolTogether')

export const POOL_TOGETHER_GOVERNANCE: GovernanceInfo = {
  id: 'pool',
  name: 'PoolTogether Governance',
  logo: PoolLogo,
  primaryColor: '#5c0ef3',
  secondaryColor: '#f2eeff',
  token: serializeToken(POOL),
  governanceAddress: POOL_TOGETHER_GOVERNANCE_ADDRESS,
  social: '@PoolTogether_',
  emoji: '🏆'
}

// mapping for routing
export const SUPPORTED_PROTOCOLS: { [id: string]: GovernanceInfo } = {
  uniswap: UNISWAP_GOVERNANCE,
  compound: COMPOUND_GOVERNANCE,
  pool: POOL_TOGETHER_GOVERNANCE
}

export const FETCHING_INTERVAL = 50

export interface GovernanceState {
  // the selected option from supported protocol options
  activeProtocol: GovernanceInfo | undefined

  // filter only verified delegates
  filterActive: boolean

  // top delegates based on votes
  topDelegates: {
    [protocolID: string]: DelegateData[] | undefined
  }

  // used for paginated delegate lookup
  maxFetched: {
    [protocolID: string]: number | undefined
  }

  // only delegates with verified usernames
  verifiedDelegates: {
    [protocolID: string]: DelegateData[] | undefined
  }

  globalData: {
    [protocolID: string]: GlobaData | undefined
  }
}

export const initialState: GovernanceState = {
  activeProtocol: undefined,
  filterActive: false,

  // top delegates and pagination details
  topDelegates: {},
  maxFetched: {},

  verifiedDelegates: {},
  globalData: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateActiveProtocol, (state, action) => {
      state.activeProtocol = action.payload.activeProtocol
    })
    .addCase(updateFilterActive, (state, action) => {
      state.filterActive = action.payload.filterActive
    })
    .addCase(updateTopDelegates, (state, action) => {
      state.topDelegates[action.payload.protocolID] = action.payload.topDelegates
    })
    .addCase(updateVerifiedDelegates, (state, action) => {
      state.verifiedDelegates[action.payload.protocolID] = action.payload.verifiedDelegates
    })
    .addCase(updateGlobalData, (state, action) => {
      state.globalData[action.payload.protocolID] = action.payload.data
    })
    .addCase(updateMaxFetched, (state, action) => {
      state.maxFetched[action.payload.protocolID] = action.payload.maxFetched
    })
)
