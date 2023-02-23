# Before you begin

- See the main [../README.md](../README.md).
- See the npm scripts in [package.json](package.json).

# Anchor Solana Program

```shell
anchor build
anchor deploy
```

Copy the **program ID** from the output logs; paste it in [Anchor.toml](Anchor.toml) & [lib.rs](programs/sollery/src/lib.rs).

```shell
anchor build
anchor deploy

yarn install
yarn add ts-mocha

anchor run test
```

# calculator

This project was created by Seahorse 0.2.7.

To get started, just add your code to **programs_py/calculator.py** and run `seahorse build`.

```shell
$ seahorse build
```

`seahorse build` fails the first time. Running it a 2nd time (or just `anchor build`) fixes the issue. That's why there's a `;`, not a `&&` between `seahorse build` and `anchor build` in [package.json](package.json)
