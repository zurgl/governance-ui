import BN from 'bn.js'
import { registerRealm } from 'actions/registerRealm'
import { depositGoverningTokens } from 'actions/depositGoverningTokens'
import { withdrawGoverningTokens } from 'actions/withdrawGoverningTokens'

import { RpcContext } from '@models/core/api'
import {
  createAndMintCommnunityToken,
  // createAndMintCouncilToken,
} from './utils/token'
import { Keypair, PublicKey } from '@solana/web3.js'

import {
  COMMUNITY_MINT,
  CONNECTION,
  // COUNCIL_MINT,
  FOUNDER,
  PROGRAM_PK,
  PROGRAM_VERSION,
  RPC_ENDPOINT,
  UNIT,
  // VOTE_WEIGHT,
} from './utils/constants'
import { MintMaxVoteWeightSource } from '@models/accounts'

describe('Unitary testing of program write-instruction', () => {
  let founder: Keypair
  let communityTokenOwnerPk: PublicKey
  // let councilTokenOwnerPk: PublicKey
  let rpcContext: RpcContext
  let programId: PublicKey
  const programVersion = 1
  let realmPk: PublicKey

  beforeAll(async () => {
    /*
     * Create and mint the tokens: Community and council
     */
    founder = FOUNDER
    communityTokenOwnerPk = await createAndMintCommnunityToken()
    // councilTokenOwnerPk = await createAndMintCouncilToken()
    programId = PROGRAM_PK
    rpcContext = new RpcContext(
      PROGRAM_PK,
      PROGRAM_VERSION,
      FOUNDER,
      CONNECTION,
      RPC_ENDPOINT
    )
  })

  test('check globals', async () => {
    expect(founder.publicKey.toBase58()).toEqual(
      'B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv'
    )

    expect(communityTokenOwnerPk.toBase58()).toEqual(
      '6TPQhsRoxMvCaBkDo9TtDYA3vakj6VQM7SNpryK3iEcc'
    )

    // expect(councilTokenOwnerPk.toBase58()).toEqual(
    //   'HmYBXnMLx5XLgE3uxoiTawMy94xnGA4u5vP1mqh3yh17'
    // )
  })

  test('registerRealm', async () => {
    const realmName = 'test-DAO'
    const voteWeightSource = MintMaxVoteWeightSource.FULL_SUPPLY_FRACTION
    const minTokensToCreateGovernance = new BN(UNIT)
    realmPk = await registerRealm(
      rpcContext,
      programId,
      programVersion,
      realmName,
      COMMUNITY_MINT,
      undefined,
      voteWeightSource,
      minTokensToCreateGovernance,
      [founder.publicKey]
    )

    expect(realmPk.toBase58()).toEqual(
      '6edoFANwjWcui3TCm9pS6a5e98PVVWf4BV4wXayHomxj'
    )
  })

  test('Deposit Governing Tokens with Amount', async () => {
    await depositGoverningTokens(
      rpcContext,
      realmPk,
      communityTokenOwnerPk,
      COMMUNITY_MINT
    )
  })

  test('Withdraw Governing Tokens', async () => {
    await withdrawGoverningTokens(
      rpcContext,
      realmPk,
      communityTokenOwnerPk,
      COMMUNITY_MINT
    )
  })

  /*
  test('Deposit Governing Tokens with Amount', async () => {
    await depositGoverningTokens(
      rpcContext,
      realmPk,
      communityTokenOwnerPk,
      COMMUNITY_MINT,
      new BN(VOTE_WEIGHT)
    )
  })

  test('Withdraw Governing Tokens', async () => {
    await withdrawGoverningTokens(
      rpcContext,
      realmPk,
      communityTokenOwnerPk,
      COMMUNITY_MINT
    )
  })
  test('Deposit All owned Governing Tokens', async () => {
    const allTokenAmount =  
    await depositGoverningTokens(
      rpcContext,
      realmPk,
      communityTokenOwnerPk,
      COMMUNITY_MINT
      )
    })
    */
})
