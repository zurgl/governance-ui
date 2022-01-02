import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { Proposal } from '@models/accounts'
import { RpcContext } from '@models/core/api'
import { ParsedAccount } from '@models/core/accounts'
import { withRelinquishVote } from '@models/withRelinquishVote'

export const relinquishVote = async (
  { connection, wallet, programId, walletPubkey }: RpcContext,
  proposal: ParsedAccount<Proposal>,
  tokenOwnerRecord: PublicKey,
  voteRecord: PublicKey,
  instructions: TransactionInstruction[] = []
) => {
  const governanceAuthority = walletPubkey
  const beneficiary = walletPubkey

  withRelinquishVote(
    instructions,
    programId,
    proposal.info.governance,
    proposal.pubkey,
    tokenOwnerRecord,
    proposal.info.governingTokenMint,
    voteRecord,
    governanceAuthority,
    beneficiary
  )

  const transaction = new Transaction()
  transaction.add(...instructions)

  await sendAndConfirmTransaction(connection, transaction, [wallet as Keypair])
}
