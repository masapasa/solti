# The program ID is generated the first time we deploy to localnet. Instead of copying and pasting it manually, let's use sed:
sed "s/^sollery = \"[a-zA-Z0-9]*\"$/sollery = \"`solana address -k target/deploy/sollery-keypair.json`\"/" Anchor.toml -i
sed "s/^calculator = \"[a-zA-Z0-9]*\"$/calculator = \"`solana address -k target/deploy/calculator-keypair.json`\"/" Anchor.toml -i