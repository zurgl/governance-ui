import {
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  TransactionInstruction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  Token,
  TOKEN_PROGRAM_ID,
  MintLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import bs58 from 'bs58'
import { Context } from './context'
import { DECIMAL, FOUNDER, COUNCIL_SUPPLY, COMMUNITY_SUPPLY } from './constants'

export const createAndMintCommnunityToken = async () =>
  createAndMintToken(FOUNDER, COMMUNITY_SUPPLY, false)

export const createAndMintCouncilToken = async () =>
  createAndMintToken(FOUNDER, COUNCIL_SUPPLY, true)

const councilTokenPk = () =>
  Keypair.fromSecretKey(
    bs58.decode(
      '5ZLjvE99V9hD7kvGbnWj2F9iDSxUxcQVCP38fgdykuRZKPWzxBPcTYDywTTCdxr12yBxvi24x4fW5rNpKu4w1gNi'
    )
  )

const communityTokenPk = () =>
  Keypair.fromSecretKey(
    bs58.decode(
      '4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp'
    )
  )

const createAndMintToken = async (
  wallet: Keypair,
  supply: number,
  isCouncilToken: boolean
) => {
  try {
    const { connection } = Context.get()
    const tokenMintPk = await createMintToken(
      connection,
      wallet,
      isCouncilToken
    )
    const tokenOwnerPk = await createAccount(connection, wallet, tokenMintPk)
    await mintToken(connection, wallet, tokenMintPk, tokenOwnerPk, supply)
    return tokenOwnerPk
  } catch (error) {
    console.error('createAndMintToken onError', (error as Error).message)
    process.exit(1)
  }
}

export const createMintToken = async (
  connection: Connection,
  wallet: Keypair,
  isCouncilToken: boolean
): Promise<PublicKey> => {
  try {
    const tokenPk = isCouncilToken ? councilTokenPk() : communityTokenPk()
    const feePayer = wallet.publicKey
    const owner = wallet.publicKey
    const tx = new Transaction({ feePayer: wallet.publicKey }).add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey: tokenPk.publicKey,
        space: MintLayout.span,
        lamports: await Token.getMinBalanceRentForExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        tokenPk.publicKey,
        DECIMAL,
        owner,
        null
      )
    )
    await sendAndConfirmTransaction(connection, tx, [wallet, tokenPk])
    return tokenPk.publicKey
  } catch (error) {
    console.error('create_token onError', (error as Error).message)
    process.exit(1)
  }
}

export const createAccount = async (
  connection: Connection,
  wallet: Keypair,
  tokenKP: PublicKey
): Promise<PublicKey> => {
  const tokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
    TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
    tokenKP, // mint
    wallet.publicKey // owner
  )

  const ataTransaction = new Transaction({ feePayer: wallet.publicKey }).add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      tokenKP, // mint
      tokenAddress, // ata
      wallet.publicKey, // owner of token account
      wallet.publicKey // fee payer
    )
  )
  await sendAndConfirmTransaction(connection, ataTransaction, [wallet])
  return tokenAddress
}

export const mintToken = async (
  connection: Connection,
  wallet: Keypair,
  tokenPK: PublicKey,
  tokenAddress: PublicKey,
  supply: number
): Promise<void> => {
  const mintInstructions: TransactionInstruction[] = []
  mintInstructions.push(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      tokenPK, // mint
      tokenAddress, // receiver (sholud be a token account)
      wallet.publicKey, // mint authority
      [], // only multisig account will use. leave it empty now.
      supply // amount. if your decimals is 8, you mint 10^8 for 1 token.
    )
  )

  const mintTransaction = new Transaction({ feePayer: wallet.publicKey }).add(
    ...mintInstructions
  )
  await sendAndConfirmTransaction(connection, mintTransaction, [wallet])
}

export const transferToken = async (
  connection: Connection,
  owner: Keypair,
  fromAta: PublicKey,
  toAta: PublicKey,
  tokenPK: PublicKey,
  amount: number
): Promise<void> => {
  // Transfer stuff
  const transferInstructions: TransactionInstruction[] = []
  transferInstructions.push(
    Token.createTransferCheckedInstruction(
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      fromAta, // from (should be a token account)
      tokenPK, // mint
      toAta, // to (should be a token account)
      owner.publicKey, // owner of from
      [], // for multisig account, leave empty.
      amount, // amount, if your deciamls is 8, send 10^8 for 1 token
      DECIMAL // decimals
    )
  )
  const transferTransaction = new Transaction({
    feePayer: owner.publicKey,
  }).add(...transferInstructions)
  await sendAndConfirmTransaction(connection, transferTransaction, [owner])
}

export const airdrop = async (connection: Connection, pk: PublicKey) => {
  const hash = await connection.requestAirdrop(pk, 100 * LAMPORTS_PER_SOL)
  await connection.confirmTransaction(hash)
}
