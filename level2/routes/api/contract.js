var express = require('express');
var router = express.Router();
const { ethers } = require("ethers")
require("dotenv").config();

//BNB Chain RPC
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
const provider = new ethers.providers.JsonRpcProvider(rpc)

const DSTT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function mint(address to, uint256 amount)",
    "function transfer(address to, uint amount) returns (bool)",
];

// DSTT contract
const contractAddress = '0x715696b3AEA58920E1F5A4cF161e843405D2d384'
const contract = new ethers.Contract(contractAddress, DSTT_ABI, provider)

const mnemonic = process.env.mnemonicPhase;
const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)
wallet = walletMnemonic.connect(provider)


router.route('/mint')
    .post(async function (req, res) {
        console.log(wallet.address)
        const dsttWithSinger = contract.connect(wallet)
        try {
            let tx = await dsttWithSinger.mint(wallet.address, ethers.utils.parseEther(String(req.body.amount)))
            const receipt = await tx.wait()
            console.log(tx)
            res.status(200).json({
                code: res.statusCode,
                error: false,
                message: `Mint ${req.body.amount} Tokens successfully`,
            });
        }
        catch (e) {
            console.log(JSON.stringify(e))
            res.status(400).json({
                code: res.statusCode,
                error: true,
                message: e.reason
            });
        }
    })

router.route('/transfer')
    .post(async function (req, res) {
        const dsttWithSinger = contract.connect(wallet)
        try {
            let tx = await dsttWithSinger.transfer(req.body.transferTo, ethers.utils.parseEther(String(req.body.amount)))
            const receipt = await tx.wait()
            console.log(tx)
            res.status(200).json({
                code: res.statusCode,
                error: false,
                message: `Transfer ${req.body.amount}Tokens to ${req.body.transferTo} successfully`
            });
        }
        catch (e) {
            console.log(JSON.stringify(e))
            res.status(400).json({
                code: res.statusCode,
                error: true,
                message: e.reason
            });
        }
    })

module.exports = router;