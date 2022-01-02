import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { Proposal, ProposalInstruction } from '@models/accounts'

import { withExecuteInstruction } from '@models/withExecuteInstruction'
import { RpcContext } from '@models/core/api'
import { ParsedAccount } from '@models/core/accounts'

export const executeInstruction = async (
  { connection, wallet, programId }: RpcContext,
  proposal: ParsedAccount<Proposal>,
  instruction: ParsedAccount<ProposalInstruction>
) => {
  // const signers: Keypair[] = []
  const instructions: TransactionInstruction[] = []

  await withExecuteInstruction(
    instructions,
    programId,
    proposal.info.governance,
    proposal.pubkey,
    instruction.pubkey,
    instruction.info.instruction
  )

  const transaction = new Transaction()

  transaction.add(...instructions)

  await sendAndConfirmTransaction(connection, transaction, [wallet as Keypair])
}
