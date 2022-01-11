import {
  PublicKey,
  TransactionInstruction,
  Keypair,
  Transaction,
} from '@solana/web3.js'
import { sendTransaction } from '../utils/send'
import { withDepositGoverningTokens } from '@models/withDepositGoverningTokens'
import { RpcContext } from '../models/core/api'
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

import { approveTokenTransfer } from 'utils/tokens'
import { u64 } from '@solana/spl-token'

export const depositGoverningTokens = async (
  { connection, wallet, programId, walletPubkey }: RpcContext,
  realmPk: PublicKey,
  governingTokenOwner: PublicKey,
  governingTokenMint: PublicKey,
  amount?: u64
) => {
  const instructions: TransactionInstruction[] = []
  const signers: Keypair[] = []

  let transferAuthorityPk: PublicKey
  if (amount) {
    const transferAuthority = approveTokenTransfer(
      instructions,
      [],
      governingTokenOwner,
      walletPubkey,
      amount
    )

    signers.push(transferAuthority)
    transferAuthorityPk = transferAuthority.publicKey
  } else {
    transferAuthorityPk = wallet?.publicKey as PublicKey
  }

  const walletAtaPk = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    governingTokenMint,
    walletPubkey
  )

  await withDepositGoverningTokens(
    instructions,
    programId,
    realmPk,
    walletAtaPk,
    governingTokenMint,
    walletPubkey,
    transferAuthorityPk,
    walletPubkey
    // amount
  )

  const transaction = new Transaction({ feePayer: walletPubkey })
  transaction.add(...instructions)

  await sendTransaction({
    transaction,
    wallet,
    connection,
    signers,
    sendingMessage: 'Depositing governing tokens',
    successMessage: `${amount} Tokens have been deposited`,
  })
}
