const express = require('express');
const { ethers } = require('ethers');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
// Initialize Ethereum provider and contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"donor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DonationReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getDonationByKey","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDonationKeys","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"donor","type":"address"}],"name":"getDonationsByDonor","outputs":[{"components":[{"internalType":"address","name":"donor","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct DonationTracker.Donation[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const donationContract = new ethers.Contract(contractAddress, contractABI, wallet);

// Routes

// 1. Submit a donation
app.post('/donate', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).send('Invalid donation amount');
        }

        const transaction = await donationContract.donate({ value: ethers.parseEther(amount.toString()) });
        await transaction.wait();
        res.status(200).send({ message: 'Donation successful', transactionHash: transaction.hash });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 2. Retrieve all donation keys (authenticated)
app.get('/donation-keys', async (req, res) => {
    try {
        const donationKeys = await donationContract.getDonationKeys();
        res.status(200).send({ donationKeys });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 3. Retrieve specific donation data (authenticated)
app.get('/donation/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const donation = await donationContract.getDonationByKey(key);
        res.status(200).send({ donor: donation[0], amount: ethers.formatEther(donation[1]), timestamp: donation[2] });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
