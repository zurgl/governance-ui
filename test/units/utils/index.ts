import { N_COUNCIL, N_MEMBER, VOTE_WEIGHT } from './constants'
import { Context, CouncilContext, UserContext } from './context'
import { airdrop, transferToken, createAccount } from './token'
import { Keypair } from '@solana/web3.js'

export const createCouncilAndCommunity = async (community: Context[]) => {
  const {
    connection,
    wallet: founderKeys,
    communityMintPk,
    communitTokenAccountPk: communityTokenOwnerPk,
    councilMintPk,
    councilTokenAccountPk: councilTokenOwnerPk,
  } = (community[0] as CouncilContext).get()
  for (let i = 1; i < N_MEMBER; i++) {
    const wallet = Keypair.generate()
    console.log(
      `Create ${i < N_COUNCIL ? 'council' : 'community'} account: ${
        wallet.publicKey
      }`
    )
    await airdrop(connection, wallet.publicKey)
    const communityTokenAccountPk = await createAccount(
      connection,
      wallet,
      communityMintPk
    )
    await transferToken(
      connection,
      founderKeys,
      communityTokenOwnerPk,
      communityTokenAccountPk,
      communityMintPk,
      VOTE_WEIGHT
    )
    if (i < N_COUNCIL) {
      const councilTokenAccountPk = await createAccount(
        connection,
        wallet,
        councilMintPk
      )
      await transferToken(
        connection,
        founderKeys,
        councilTokenOwnerPk,
        councilTokenAccountPk,
        councilMintPk,
        VOTE_WEIGHT
      )
      community.push(
        new CouncilContext({
          wallet,
          communityTokenAccountPk,
          councilTokenAccountPk,
        })
      )
    } else {
      community.push(
        new UserContext({
          wallet,
          communityTokenAccountPk,
        })
      )
    }
  }
}
