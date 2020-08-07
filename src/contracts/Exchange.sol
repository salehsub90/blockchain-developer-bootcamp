
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
  using SafeMath for uint;

  // variable
  address public feeAccount; // account receives exchange fees
  uint256 public feePercent; // the fee percentage

  mapping(address => mapping(address => uint256)) public tokens;

  //Events
  event Deposit(address token, address user, uint256 amount, uint256 balance);

  constructor(address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  function depositToken(address _token, uint256 _amount) public {
    //TODO: Don't allow ether deposits
    
    // gets a copy of the token and transfer it
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

    // emit the event
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
}
