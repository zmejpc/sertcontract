// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract SertContract {

    address public owner;
    string public name;

    mapping(address => uint256) public balance;

    event Transfer(address _from, address _to, uint256 _amount);

    constructor() {
        owner = msg.sender;
    }

    function setName(string memory _name) external {
        require(
            msg.sender == owner,
            "You are not the owner."
        );
        name = _name;
    }

    function mint(address _receiver, uint256 _amount) public payable {
        require(
            msg.sender == owner,
            "You are not the owner."
        );
        require(
            _amount < 1e60,
            "Maximum issuance exceeded"
        );

        balance[_receiver] += _amount;
    }

    function deposit() public payable {
        require(
            msg.value > 0,
            "Deposit should be greater then 0!"
        );

        balance[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint256) {
        return balance[msg.sender];
    }

    function getContractBalance() public view returns (uint256) {
        require(
            msg.sender == owner,
            "You must be the owner of the bank to see all balances."
        );
        return address(this).balance;
    }

    function transfer(address payable _receiver, uint256 _amount) public payable {
        require(
            _amount <= balance[msg.sender],
            "Insufficient balance."
        );

        balance[msg.sender] -= _amount;
        _receiver.transfer(_amount);

        emit Transfer(address(this), _receiver, _amount);
    }
}