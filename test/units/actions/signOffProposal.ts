import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { RpcContext } from '@models/core/api'
import { SignatoryRecord } from '@models/accounts'
import { ParsedAccount } from 'models/core/accounts'
import { withSignOffProposal } from '@models/withSignOffProposal'

export const signOffProposal = async (
  { connection, wallet, programId, walletPubkey }: RpcContext,
  signatoryRecord: ParsedAccount<SignatoryRecord>
) => {
  const instructions: TransactionInstruction[] = []

  withSignOffProposal(
    instructions,
    programId,
    signatoryRecord?.info.proposal,
    signatoryRecord?.pubkey,
    walletPubkey
  )

  const transaction = new Transaction()

  transaction.add(...instructions)

  await sendAndConfirmTransaction(connection, transaction, [wallet as Keypair])
}
