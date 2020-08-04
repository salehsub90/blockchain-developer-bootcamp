
pragma solidity ^0.5.0;

contract Exchange {
  // variable
  address public feeAccount; // account receives exchange fees
  uint256 public feePercent; // the fee percentage

  constructor(address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

}

//TODO:
// [x] set the fee account
// [] Deposit Ether
// [] Withdrw Ether
// [] Deposit tokens
// [] Withdraw tokens
// [] Check Balances
// [] Make order
// [] Cancel order
// [] Fill order
// [] charge fees
