import { Keypair, PublicKey, Connection } from '@solana/web3.js'
import path from 'path'
import fs from 'mz/fs'

export const PROGRAM_VERSION = 2
export const DECIMAL = 9
export const UNIT = 10 ** DECIMAL
export const N_COUNCIL = 2
export const N_MEMBER = 5
export const COMMUNITY_SUPPLY = 100 * N_MEMBER * UNIT
export const COUNCIL_SUPPLY = 100 * N_COUNCIL * UNIT
export const VOTE_WEIGHT = 100 * UNIT
export const WALLET_PATH = path.resolve(
  'test',
  'units',
  'assets',
  'keypair.json'
)
export const RPC_ENDPOINT = 'http://127.0.0.1:8899'
export const CONNECTION = new Connection(RPC_ENDPOINT, 'confirmed')
export const PROGRAM_PK = new PublicKey(
  'DxHRU9a4Hm7rMGXZftgTHZokkMUPD2uWdyQ5paM3GPEd'
)
export const COMMUNITY_MINT = new PublicKey(
  'G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY'
)
export const COMMUNITY_TOKEN_OWNER_PK = new PublicKey(
  '6TPQhsRoxMvCaBkDo9TtDYA3vakj6VQM7SNpryK3iEcc'
)
export const COUNCIL_MINT = new PublicKey(
  'Eefka1zZmaka9wgZ8neLHBCxRp8GDWiVx56Y6UnheDrv'
)
export const COUNCIL_TOKEN_OWNER_PK = new PublicKey(
  'HmYBXnMLx5XLgE3uxoiTawMy94xnGA4u5vP1mqh3yh17'
)
export const FOUNDER_PK = new PublicKey(
  'B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv'
)
export const REALM_PK = new PublicKey(
  '6edoFANwjWcui3TCm9pS6a5e98PVVWf4BV4wXayHomxj'
)
export const REALM_NAME = 'test-DAO'

export const FOUNDER = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(WALLET_PATH, {
        encoding: 'utf8',
      })
    )
  )
)
