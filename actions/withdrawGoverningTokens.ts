import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  Keypair,
} from '@solana/web3.js'
import { RpcContext } from '../models/core/api'

import { withWithdrawGoverningTokens } from '../models/withWithdrawGoverningTokens'
import { sendTransaction } from '../utils/send'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export const withdrawGoverningTokens = async (
  { connection, wallet, programId, walletPubkey }: RpcContext,
  realm: PublicKey,
  governingTokenDestination: PublicKey,
  governingTokenMint: PublicKey
) => {
  const instructions: TransactionInstruction[] = []
  const signers: Keypair[] = []

  await withWithdrawGoverningTokens(
    instructions,
    programId,
    realm,
    governingTokenDestination,
    governingTokenMint,
    walletPubkey,
    TOKEN_PROGRAM_ID
  )

  const transaction = new Transaction({ feePayer: walletPubkey })
  transaction.add(...instructions)

  await sendTransaction({
    transaction,
    wallet,
    connection,
    signers,
    sendingMessage: 'Withdrawing governing tokens',
    successMessage: 'Tokens have been withdrawn',
  })
}
