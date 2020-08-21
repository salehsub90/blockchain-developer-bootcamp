
pragma solidity ^0.5.0;

import "./Token.sol";


//TODO:
// [x] set the fee account
// [x] Deposit Ether
// [x] Withdrw Ether
// [x] Deposit tokens
// [x] Withdraw tokens
// [x] Check Balances
// [x] Make order // need to model the order
// [x] Cancel order
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

  // store the order
  mapping(uint256 => _Order) public orders;
  uint256 public orderCount;

  //cancel orders specific
  mapping(uint256 => bool) public orderCancelled;

  //Events
  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint256 amount, uint256 balance);
  event Order(
    uint256 id,
    address user,
    address tokenGet,
    uint256 amountGet,
    address tokenGive,
    uint256 amountGive,
    uint256 timestamp
  );
  event Cancel(
    uint256 id,
    address user,
    address tokenGet,
    uint256 amountGet,
    address tokenGive,
    uint256 amountGive,
    uint256 timestamp
  );

  // model the order using structs
  struct _Order {
    uint256 id;
    address user;
    address tokenGet;
    uint256 amountGet;
    address tokenGive;
    uint256 amountGive;
    uint256 timestamp;
  }

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

  function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
    orderCount = orderCount.add(1);
    orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
  }

  function cancelOrder(uint256 _id) public {
    // need to fetch order from storage
    _Order storage _order = orders[_id];
    
    require(address(_order.user) == msg.sender); // Must be "my" order
    require(_order.id == _id); // Must be a valid order and exist
    orderCancelled[_id] = true;

    emit Cancel(_id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, now);
  }

  function fillOrder(uint256 _id) public {
    _Order storage _order = orders[_id]; // fetch the order from storage
    _trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);

    // mark as filled
  }

  // execute trade
  // charge fees
  // Emit a trade event
  function _trade(uint256 _orderId, 
    address _user, address _tokenGet, 
    uint256 _amountGet, address _tokenGive, 
    uint256 _amountGive) internal {

      // msg.sender is the user who is filling the order
      // _user is the user who created the order
      
      
  }
}
