// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ThoughtLedger
 * @dev A decentralized platform for sharing thoughts on the blockchain
 * @author Your Name
 */
contract ThoughtLedger is ReentrancyGuard, Ownable {
    
    // Events
    event ThoughtPosted(
        address indexed sender,
        string name,
        string message,
        uint256 timestamp,
        uint256 thoughtId
    );
    
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    // Structs
    struct Thought {
        string name;
        string message;
        uint256 timestamp;
        address sender;
        uint256 thoughtId;
    }
    
    // State variables
    Thought[] public thoughts;
    uint256 public postingFee = 0.0001 ether;
    uint256 public totalThoughts;
    
    // Modifiers
    modifier validPayment() {
        require(msg.value >= postingFee, "Insufficient payment");
        _;
    }
    
    modifier validInput(string memory _name, string memory _message) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_name).length <= 50, "Name too long");
        require(bytes(_message).length <= 500, "Message too long");
        _;
    }
    
    /**
     * @dev Post a new thought to the blockchain
     * @param _name The name of the person posting
     * @param _message The thought/message to post
     */
    function postThought(
        string calldata _name, 
        string calldata _message
    ) external payable validPayment validInput(_name, _message) nonReentrant {
        // Create new thought
        Thought memory newThought = Thought({
            name: _name,
            message: _message,
            timestamp: block.timestamp,
            sender: msg.sender,
            thoughtId: totalThoughts
        });
        
        // Add to thoughts array
        thoughts.push(newThought);
        totalThoughts++;
        
        // Emit event
        emit ThoughtPosted(
            msg.sender,
            _name,
            _message,
            block.timestamp,
            totalThoughts - 1
        );
    }
    
    /**
     * @dev Get all thoughts from the blockchain
     * @return Array of all thoughts
     */
    function getAllThoughts() external view returns (Thought[] memory) {
        return thoughts;
    }
    
    /**
     * @dev Get a specific thought by ID
     * @param _thoughtId The ID of the thought to retrieve
     * @return The thought at the specified ID
     */
    function getThought(uint256 _thoughtId) external view returns (Thought memory) {
        require(_thoughtId < thoughts.length, "Thought does not exist");
        return thoughts[_thoughtId];
    }
    
    /**
     * @dev Get the total number of thoughts
     * @return The total count of thoughts
     */
    function getThoughtCount() external view returns (uint256) {
        return thoughts.length;
    }
    
    /**
     * @dev Update the posting fee (owner only)
     * @param _newFee The new fee amount in wei
     */
    function updatePostingFee(uint256 _newFee) external onlyOwner {
        require(_newFee > 0, "Fee must be greater than 0");
        postingFee = _newFee;
    }
    
    /**
     * @dev Withdraw accumulated funds (owner only)
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Get contract balance
     * @return The current balance of the contract
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get current posting fee
     * @return The current fee required to post a thought
     */
    function getPostingFee() external view returns (uint256) {
        return postingFee;
    }
    
    /**
     * @dev Emergency function to pause contract (owner only)
     * Note: This is a placeholder for future implementation
     */
    function emergencyPause() external onlyOwner {
        // Implementation for pausing functionality
        // This would require additional state management
    }
} 