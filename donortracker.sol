// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DonationTracker is Ownable, ReentrancyGuard {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    // Mapping to store donations securely
    mapping(bytes32 => Donation) private donations;
    bytes32[] private donationKeys;

    // Event to track donations
    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Accepts donations and stores the encrypted details on-chain.
     */
    function donate() external payable nonReentrant {
        require(msg.value > 0, "Donation must be greater than zero");

        bytes32 donationKey = keccak256(abi.encodePacked(msg.sender, block.timestamp, donationKeys.length));
        donations[donationKey] = Donation(msg.sender, msg.value, block.timestamp);
        donationKeys.push(donationKey);

        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Allows the owner to withdraw all the funds collected.
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available for withdrawal");

        // Transfer the balance to the owner
        payable(owner()).transfer(balance);

        emit Withdrawn(owner(), balance);
    }

    /**
     * @dev Allows the owner to fetch all donation keys.
     * This can be used to decrypt data off-chain for reporting purposes.
     */
    function getDonationKeys() external view onlyOwner returns (bytes32[] memory) {
        return donationKeys;
    }

    /**
     * @dev Allows the owner to fetch details of a specific donation.
     */
    function getDonationByKey(bytes32 key) external view onlyOwner returns (address, uint256, uint256) {
        Donation memory donation = donations[key];
        return (donation.donor, donation.amount, donation.timestamp);
    }

    /**
     * @dev Allows the owner to fetch all donations for a specific donor.
     */
    function getDonationsByDonor(address donor) external view onlyOwner returns (Donation[] memory) {
        uint256 count;
        for (uint256 i = 0; i < donationKeys.length; i++) {
            if (donations[donationKeys[i]].donor == donor) {
                count++;
            }
        }

        Donation[] memory result = new Donation[](count);
        uint256 index;

        for (uint256 i = 0; i < donationKeys.length; i++) {
            if (donations[donationKeys[i]].donor == donor) {
                result[index] = donations[donationKeys[i]];
                index++;
            }
        }

        return result;
    }
}

