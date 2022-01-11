import { Keypair, PublicKey, Connection } from '@solana/web3.js'
import path from 'path'
import fs from 'mz/fs'

const WALLET_PATH = path.resolve('wallet', 'keypair.json')
const RPC_ENDPOINT = 'http://127.0.0.1:8899'
const PROGRAM_PK = 'DxHRU9a4Hm7rMGXZftgTHZokkMUPD2uWdyQ5paM3GPEd'
const COMMUNITY_MINT = 'G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY'
const COUNSIL_MINT = 'Eefka1zZmaka9wgZ8neLHBCxRp8GDWiVx56Y6UnheDrv'

// communityTokenOwnerPk: 6TPQhsRoxMvCaBkDo9TtDYA3vakj6VQM7SNpryK3iEcc
// counsilTokenOwnerPk: HmYBXnMLx5XLgE3uxoiTawMy94xnGA4u5vP1mqh3yh17

export const founderKeys = () =>
  Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        fs.readFileSync(WALLET_PATH, {
          encoding: 'utf8',
        })
      )
    )
  )

export class Context {
  static #connection = new Connection(RPC_ENDPOINT, 'confirmed')
  static #programPk = new PublicKey(PROGRAM_PK)
  static #communityMintPk = new PublicKey(COMMUNITY_MINT)
  #isCouncilMember = false

  static get connection() {
    return Context.#connection
  }

  static get programPk() {
    return Context.#programPk
  }

  static get programPkBs58() {
    return Context.#programPk.toBase58()
  }

  static get commnutiyPk() {
    return Context.#communityMintPk
  }

  static get commnutiyPkBs58() {
    return Context.#communityMintPk.toBase58()
  }

  static get() {
    return {
      connection: Context.#connection,
      programPk: Context.#programPk,
      communityMintPk: Context.#communityMintPk,
    }
  }

  get isCouncilMember() {
    return this.#isCouncilMember
  }

  set isCouncilMember(bool) {
    this.#isCouncilMember = bool
  }
}

export class UserContext extends Context {
  #wallet: Keypair
  #communityTokenAccountPk: PublicKey

  constructor(args: { wallet: Keypair; communityTokenAccountPk: PublicKey }) {
    super()
    this.#wallet = args.wallet
    this.#communityTokenAccountPk = args.communityTokenAccountPk
  }

  get wallet() {
    return this.#wallet
  }

  get publicKey() {
    return this.#wallet.publicKey
  }

  get communityMintPk() {
    return Context.commnutiyPk
  }

  get communityMintPkBs58() {
    return Context.commnutiyPk.toBase58()
  }

  get publicKeyBs58() {
    return this.#wallet.publicKey.toBase58()
  }

  get communityTokenAccountPk() {
    return this.#communityTokenAccountPk
  }

  get communityTokenAccountPkBs58() {
    return this.#communityTokenAccountPk.toBase58()
  }

  get() {
    return {
      ...Context.get(),
      wallet: this.#wallet,
      walletPk: this.#wallet.publicKey,
      communitTokenAccountPk: this.#communityTokenAccountPk,
    }
  }

  show() {
    console.log('==== Member ==============')
    console.log('Address:', this.publicKeyBs58)
    console.log('Community Account:', this.communityTokenAccountPkBs58)
  }
}

export class CouncilContext extends UserContext {
  static #councilMintPk = new PublicKey(COUNSIL_MINT)
  #councilTokenAccountPk: PublicKey

  constructor(args: {
    wallet: Keypair
    communityTokenAccountPk: PublicKey
    councilTokenAccountPk: PublicKey
  }) {
    super({
      wallet: args.wallet,
      communityTokenAccountPk: args.communityTokenAccountPk,
    })
    this.#councilTokenAccountPk = args.councilTokenAccountPk
    super.isCouncilMember = true
  }

  get councilMintPk() {
    return CouncilContext.#councilMintPk
  }

  get councilMintPkBs58() {
    return CouncilContext.#councilMintPk.toBase58()
  }

  get councilTokenAccountPk() {
    return this.#councilTokenAccountPk
  }

  get councilTokenAccountPkBs58() {
    return this.#councilTokenAccountPk.toBase58()
  }

  get() {
    return {
      ...super.get(),
      councilMintPk: CouncilContext.#councilMintPk,
      councilTokenAccountPk: this.#councilTokenAccountPk,
    }
  }

  show() {
    super.show()
    console.log('Council Account:', this.councilTokenAccountPkBs58)
    console.log()
  }
}
