# DonationTracker Smart Contract

# Overview

The DonationTracker smart contract is a secure and transparent solution for tracking donations 
on the blockchain. It allows users to contribute ETH as donations, securely stores donation 
details, and provides an interface for the contract owner to manage and withdraw funds.

# Features

1. Secure Donation Storage:

* Donations are stored with obfuscated data to protect donor privacy.

* Each donation is recorded with the donor's address, amount, and timestamp.

2. Role-Based Access:

* Only the contract owner can view donation details and withdraw funds.

3. Reentrancy Protection:

* Utilizes OpenZeppelin's ReentrancyGuard to safeguard against reentrancy attacks.

4. Event Logging:

* Emits events for donation tracking and withdrawals.

# Smart Contract Functionalities

1. Donate
* Accepts ETH from users as donations.
* Stores donation details (obfuscated using a hash).
* Emits a DonationReceived event

2. Withdraw Funds
* Allows the contract owner to withdraw all collected funds.
* Emits a Withdrawn event.

3. View Donation Keys
* Restricted to the owner.
* Returns all obfuscated keys for stored donations.

4. View Donation Details
* Restricted to the owner.
* Fetches details of a specific donation using its key.

5. View Donations by Donor
* Restricted to the owner.
* Returns all donations made by a specific donor.

smart contract address: 0x8Feaa83dC07F85052831099F5cBDd3Bf0438920E
smart contract deploy link: https://sepolia.etherscan.io/tx/0x5da463b40de3ab8dabb956e2e18d695b11c84bf1572e97c56427afc0fd5e2788