import {
  PublicKey,
  TransactionInstruction,
  Keypair,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { withWithdrawGoverningTokens } from '@models/withWithdrawGoverningTokens'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export const withdrawGoverningTokens = async (
  connection: Connection,
  programId: PublicKey,
  wallet: Keypair,
  realm: PublicKey,
  governingTokenDestination: PublicKey,
  governingTokenMint: PublicKey,
  governingTokenOwner: PublicKey
) => {
  const instructions: TransactionInstruction[] = []

  await withWithdrawGoverningTokens(
    instructions,
    programId,
    realm,
    governingTokenDestination,
    governingTokenMint,
    governingTokenOwner,
    TOKEN_PROGRAM_ID
  )

  const transaction = new Transaction().add(...instructions)

  await sendAndConfirmTransaction(connection, transaction, [wallet])
}
