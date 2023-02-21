```shell
$ solana-keygen new --no-bip39-passphrase -o userSecretKey.json --force > userSeedPhrase.md
Generating a new keypair
Wrote new keypair to userSecretKey.json
============================================================================
pubkey: 6gcj3FCtFAJQQab85G2i4PdubrDz2vUxuxkEz6EYqHTy
============================================================================
Save this seed phrase to recover your new keypair:
table lecture job panel walnut hybrid carbon october bulk summer group lemon
============================================================================

$ cp userSecretKey.json ~/.config/solana/id.json
```

The `solana` command line tool and Phantom generate different keypairs from the same seed phrase. The secrets keys generated by `solana` (e.g. ` ~/.config/solana/id.json`) can be imported in Phantom though. (The reverse is not true though, because Phantom exports them as strings, not numeric arrays.)