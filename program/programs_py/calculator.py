# calculator
# Built with Seahorse v0.2.7

from seahorse.prelude import *

declare_id('F71MP2c2WXJC6mMpCk3TdCjGRekmRVQ9foEqzPkz9ZCL')


class Calculator(Account):
    owner: Pubkey
    display: i64


@instruction
def init_calculator(owner: Signer, calculator: Empty[Calculator]):
    # Initialize the calculator and set the owner
    calculator = calculator.init(
        payer=owner,
        seeds=['Calculator', owner]
    )
    calculator.owner = owner.key()


@instruction
def reset_calculator(owner: Signer, calculator: Calculator):
    print(owner.key(), 'is resetting', calculator.key())

    # Verify owner
    assert owner.key() == calculator.owner, 'This is not your calculator!'

    calculator.display = 0


class Operation(Enum):
    ADD = 0
    SUB = 1
    MUL = 2
    DIV = 3


@instruction
def do_operation(owner: Signer, calculator: Calculator, op: Operation, num: i64):
    # Verify owner, like before
    assert owner.key() == calculator.owner, 'This is not your calculator!'

    if op == Operation.ADD:
        calculator.display += num
    elif op == Operation.SUB:
        calculator.display -= num
    elif op == Operation.MUL:
        calculator.display *= num
    elif op == Operation.DIV:
        calculator.display //= num
