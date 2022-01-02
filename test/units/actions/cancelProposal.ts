import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { RpcContext } from '@models/core/api'
import { Proposal } from '@models/accounts'
import { ParsedAccount } from 'models/core/accounts'
import { withCancelProposal } from '@models/withCancelProposal'

export const cancelProposal = async (
  { connection, wallet, programId, walletPubkey }: RpcContext,
  proposal: ParsedAccount<Proposal> | undefined
) => {
  const instructions: TransactionInstruction[] = []
  const governanceAuthority = walletPubkey

  withCancelProposal(
    instructions,
    programId,
    proposal!.pubkey,
    proposal!.info.tokenOwnerRecord,
    governanceAuthority
  )

  const transaction = new Transaction({ feePayer: walletPubkey })

  transaction.add(...instructions)

  await sendAndConfirmTransaction(connection, transaction, [wallet as Keypair])
}
