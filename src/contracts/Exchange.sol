
pragma solidity ^0.5.0;

import "./Token.sol";


//TODO:
// [x] set the fee account
// [x] Deposit Ether
// [] Withdrw Ether
// [x] Deposit tokens
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

  // allows to store ether in tokens mapping with blank address
  address constant ETHER = address(0);

  mapping(address => mapping(address => uint256)) public tokens;

  //Events
  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint256 amount, uint256 balance);

  constructor(address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  // fallback: reverts if Ether is sent to this smart contract yb mistake.
  function() external {
    revert();
  }


  //in  order for a function to accept Ether, add Payable
  function depositEther() payable public {
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  function withdrawEther(uint _amount) public {
    require(tokens[ETHER][msg.sender] >= _amount);
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
    msg.sender.transfer(_amount);
    emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
  }

  function depositToken(address _token, uint256 _amount) public {
    //TODO: Don't allow ether deposits
    require(_token != ETHER);
    // gets a copy of the token and transfer it
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

    // emit the event
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function withdrawToken(address _token, uint256 _amount) public {
    require(_token != ETHER);
    require(tokens[_token][msg.sender] >= _amount);

    tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
    require(Token(_token).transfer(msg.sender, _amount));
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function balanceOf(address _token, address _user) public view returns (uint256) {
    return tokens[_token][_user];
  }
}
