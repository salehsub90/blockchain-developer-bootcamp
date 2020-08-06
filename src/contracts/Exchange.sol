
pragma solidity ^0.5.0;

import "./Token.sol";

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


contract Exchange {
  // variable
  address public feeAccount; // account receives exchange fees
  uint256 public feePercent; // the fee percentage

  constructor(address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  function depositToken(address _token, uint256 _amount) public {
    // which token
    // how much
    // send token to this contract
    // gets a copy of the token and trsnfer it
    Token(_token).transferFrom(msg.sender, address(this), _amount)
    // manage deposit
    // emit the event
  }
}
