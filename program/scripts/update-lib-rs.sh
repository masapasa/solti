# The program ID is generated the first time we deploy to localnet. Instead of copying and pasting it manually, let's use sed:
sed "s/^declare_id\!(\"[a-zA-Z0-9]*\");$/declare_id\!(\"`solana address -k target/deploy/sollery-keypair.json`\");/" programs/sollery/src/lib.rs -i
sed "s/^declare_id\!(\"[a-zA-Z0-9]*\");$/declare_id\!(\"`solana address -k target/deploy/calculator-keypair.json`\");/" programs/calculator/src/lib.rs -i

sed -E "s/^declare_id\('[a-zA-Z0-9]*'\)$/declare_id('`solana address -k target/deploy/calculator-keypair.json`')/" programs_py/calculator.py -i
