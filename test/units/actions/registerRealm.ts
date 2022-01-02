import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
  Keypair,
} from '@solana/web3.js'
import BN from 'bn.js'
import { MintMaxVoteWeightSource } from '@models/accounts'
import { withCreateRealm } from '@models/withCreateRealm'
import { RpcContext } from '@models/core/api'
import { ProgramVersion } from '@models/registry/constants'

export async function registerRealm(
  { connection, wallet, walletPubkey }: RpcContext,
  programId: PublicKey,
  programVersion: ProgramVersion,
  name: string,
  communityMint: PublicKey,
  councilMint: PublicKey | undefined,
  communityMintMaxVoteWeightSource: MintMaxVoteWeightSource,
  minCommunityTokensToCreateGovernance: BN
): Promise<PublicKey> {
  const instructions: TransactionInstruction[] = []

  const realmAddress = await withCreateRealm(
    instructions,
    programId,
    programVersion,
    name,
    walletPubkey,
    communityMint,
    walletPubkey,
    councilMint,
    communityMintMaxVoteWeightSource,
    minCommunityTokensToCreateGovernance,
    undefined
  )

  const transaction = new Transaction().add(...instructions)
  await sendAndConfirmTransaction(connection, transaction, [wallet as Keypair])

  return realmAddress
}
