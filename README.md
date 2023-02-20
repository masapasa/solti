# sollery

[app](app/README.md) (the Next.js application) and [program](app/README.md) (the Solana backend) have their own READMEs.

## Quick start

### Terminal 1

```
cd program && npm run validator
```

### Terminal 2

```
cd program && npm run init
```

### Terminal 3

```
cd app && npm i && npm run dev
```

## For debugging only

### Generate a project template

```
$ npx create-solana-dapp sollery
Need to install the following packages:
  create-solana-dapp@1.0.3
Ok to proceed? (y)

Creating Solana dApp

    UI Framework      :  next
    Program Framework :  anchor
```

### Verify versions

```shell
$ solana-test-validator --version
solana-test-validator 1.14.16 (src:ab6f3bda; feat:3488713414)

$ anchor --version
anchor-cli 0.26.0

$ solana --version
solana-cli 1.14.16 (src:ab6f3bda; feat:3488713414)

$ sed --version
sed (GNU sed) 4.9

$ grep --version
grep (BSD grep, GNU compatible) 2.6.0-FreeBSD
```

### Terminal 1

```
$ cd program

$ solana-test-validator # Creates a 'test-ledger' folder in 'program'.
...
JSON RPC URL: http://127.0.0.1:8899
```

### Terminal 2

```shell
$ cd program

$ anchor build
...

$ anchor deploy
...
Program Id: 5KeLPA4bsXnC9XxcVgAdKcFTNiYx74CHxa4FvLgBR2rU
...

$ solana address -k target/deploy/sollery-keypair.json
5KeLPA4bsXnC9XxcVgAdKcFTNiYx74CHxa4FvLgBR2rU

$ grep sollery Anchor.toml
sollery = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

$ sed "s/^sollery = \"[a-zA-Z0-9]*\"$/sollery = \"`solana address -k target/deploy/sollery-keypair.json`\"/" Anchor.toml -i

$ grep sollery Anchor.toml
sollery = "5KeLPA4bsXnC9XxcVgAdKcFTNiYx74CHxa4FvLgBR2rU"

$ grep declare_id programs/sollery/src/lib.rs
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

$ sed "s/^declare_id\!(\"[a-zA-Z0-9]*\");$/declare_id\!(\"`solana address -k target/deploy/sollery-keypair.json`\");/" programs/sollery/src/lib.rs -i

$ grep declare_id programs/sollery/src/lib.rs
declare_id!("5KeLPA4bsXnC9XxcVgAdKcFTNiYx74CHxa4FvLgBR2rU");

$ echo "\n[test.validator]\nbind_address = \"127.0.0.1\"">>Anchor.toml

$ anchor run test
...
  1 passing (319ms)

✨  Done in 5.53s.
```

### Terminal 3

```shell
$ cd app

$ npm i

$ npm run dev
```