import {
  PublicKey,
  TransactionInstruction,
  Keypair,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { withDepositGoverningTokens } from '@models/withDepositGoverningTokens'

import { approveTokenTransfer } from 'utils/tokens'
import { u64 } from '@solana/spl-token'

export const depositGoverningTokens = async (
  connection: Connection,
  programId: PublicKey,
  signer: Keypair,
  realm: PublicKey,
  governingTokenSourcePubkey: PublicKey,
  governingTokenMint: PublicKey,
  amount: u64
) => {
  const instructions: TransactionInstruction[] = []
  const signers: Keypair[] = []
  const signerPubkey = signer.publicKey

  const transferAuthority = approveTokenTransfer(
    instructions,
    [],
    governingTokenSourcePubkey,
    signerPubkey,
    amount
  )

  signers.push(transferAuthority)
  signers.push(signer)

  await withDepositGoverningTokens(
    instructions,
    programId,
    realm,
    governingTokenSourcePubkey,
    governingTokenMint,
    signerPubkey,
    transferAuthority.publicKey,
    signerPubkey,
    amount
  )

  // @ts-ignore
  const transaction = new Transaction({ feePayer: signer.publicKey }).add(
    ...instructions
  )
  await sendAndConfirmTransaction(connection, transaction, signers)
}
