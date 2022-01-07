# Launch a local validator

```text
solana-test-validator -r
```

# Compile the V1

```
git clone git@github.com:solana-labs/solana-program-library.git spl
cd spl
git reset --hard 12732f8d5a96bbbfcf0274b208849b6de0e5b0b0
cargo build-bpf
file target/deploy/spl_governance.so
```

# Deploy the V1 with the V2 default programId

```text
solana program deploy --upgrade-authority test/units/assets/keypair.json \
  test/units/assets/spl_governanceV1.so \
  --program-id test/units/assets/spl_governance-keypair.json
```

# Solana explorer on localnet

```text
https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2F127.0.0.1%3A8899
```

# Check the result of V2 api

```text
http://localhost:3000/#/?programId=DxHRU9a4Hm7rMGXZftgTHZokkMUPD2uWdyQ5paM3GPEd
```

solana transfer --allow-unfunded-recipient DxHRU9a4Hm7rMGXZftgTHZokkMUPD2uWdyQ5paM3GPEd 500
