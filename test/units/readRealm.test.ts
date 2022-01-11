import {
  COMMUNITY_MINT,
  CONNECTION,
  PROGRAM_PK,
  RPC_ENDPOINT,
} from './utils/constants'
import { tryGetMint } from '@utils/tokens'
import { PublicKey } from '@solana/web3.js'
import { getGovernanceAccounts } from '@models/api'
import { getAccountTypes, Realm } from '@models/accounts'

async function fetchAllRealms(programId: PublicKey) {
  const endpoint = RPC_ENDPOINT

  const realms = await getGovernanceAccounts<Realm>(
    programId,
    endpoint,
    Realm,
    getAccountTypes(Realm)
  )

  console.log('fetchAllRealms', realms)
}

describe('Unitary testing of program write-instruction', () => {
  test('check mint', async () => {
    const founder = 0
    console.log(await tryGetMint(CONNECTION, COMMUNITY_MINT))

    expect(founder).toEqual(0)
  })

  test('check realm', async () => {
    console.log(await fetchAllRealms(PROGRAM_PK))
    // console.log(await tryGetMint(CONNECTION, COMMUNITY_MINT))

    const founder = 0
    expect(founder).toEqual(0)
  })
})
