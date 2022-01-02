import { InstructionData } from '@models/accounts'

import {
  Connection,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { WalletAdapter } from '@solana/wallet-adapter-base'

export async function dryRunInstruction(
  wallet: WalletAdapter,
  instructionData: InstructionData,
  prerequisiteInstructionsToRun?: TransactionInstruction[] | undefined
) {
  const transaction = new Transaction({ feePayer: wallet.publicKey })
  if (prerequisiteInstructionsToRun) {
    prerequisiteInstructionsToRun.map((x) => transaction.add(x))
  }
  transaction.add({
    keys: instructionData.accounts,
    programId: instructionData.programId,
    data: Buffer.from(instructionData.data),
  })

  const singleGossipConnection = new Connection(
    'http://127.0.0.1:8899',
    'singleGossip'
  )
  const result = await singleGossipConnection.simulateTransaction(transaction)

  return { response: result.value, transaction }
}
