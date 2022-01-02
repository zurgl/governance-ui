import { ParsedAccount } from '@models/core/accounts'
import { RpcContext } from '@models/core/api'
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { Proposal } from '@models/accounts'
import { withFinalizeVote } from '@models/withFinalizeVote'

export const finalizeVote = async (
  { connection, wallet, programId }: RpcContext,
  realm: PublicKey,
  proposal: ParsedAccount<Proposal>
) => {
  // const signers: Keypair[] = []
  const instructions: TransactionInstruction[] = []

  withFinalizeVote(
    instructions,
    programId,
    realm,
    proposal.info.governance,
    proposal.pubkey,
    proposal.info.tokenOwnerRecord,
    proposal.info.governingTokenMint
  )

  const transaction = new Transaction()

  transaction.add(...instructions)
  await sendAndConfirmTransaction(connection, transaction, [wallet as Keypair])
}
