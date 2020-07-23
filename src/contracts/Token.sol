pragma solidity ^0.5.0;

contract Token {
  string public name = "DApp Token";
  string public symbol = "DApp";
  uint256 public decimals = 18;
  uint256 public totalSupply;

  //msg is global variable in blokchan
  //becomes a function with the word public.
  // Track balances
  mapping(address => uint256) public balanceOf;
  // Send tokens

  constructor() public {
    totalSupply = 1000000 * (10 ** decimals);
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);