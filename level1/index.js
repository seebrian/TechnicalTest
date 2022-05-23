const { ethers } = require("ethers")
require("dotenv").config();

//BNB Chain RPC
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
const provider = new ethers.providers.JsonRpcProvider(rpc)

const DSTT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function mint(address to, uint256 amount)",
    "function transfer(address to, uint amount) returns (bool)",
];

//Mnemonic phase
const mnemonic = process.env.mnemonicPhase;

// DSTT contract
const contractAddress = '0x715696b3AEA58920E1F5A4cF161e843405D2d384'
const contract = new ethers.Contract(contractAddress, DSTT_ABI, provider)

//transfer to
const contractOwnerAddress = '0x3126081ee598F6658eF6b1aA6A067484759DE4cA'

const main = async () => {
    let walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)
    wallet = walletMnemonic.connect(provider)
    console.log(`Wallet adress: ${wallet.address}`)
    const balance = await provider.getBalance(wallet.address)
    console.log(`\BNB Balance of ${wallet.address} --> ${ethers.utils.formatEther(balance)} BNB\n`)

    //contract information
    const name = await contract.name()
    const symbol = await contract.symbol()
    console.log(`\nReading from ${contractAddress}`)
    console.log(`Name: ${name}`)
    console.log(`Symbol: ${symbol}`)

    //Mint 1000DSTT Tokens
    let contractOwnerBalance = await contract.balanceOf(contractOwnerAddress)
    let senderBalance = await contract.balanceOf(wallet.address)
    console.log(`\nBalance of sender: ${ethers.utils.formatEther(senderBalance)} DSTT`)
    console.log(`Balance of contract owner: ${ethers.utils.formatEther(contractOwnerBalance)} DSTT`)
    console.log(`Mint 100DSTT tokens`)
    const dsttWithSinger = contract.connect(wallet)
    let tx = await dsttWithSinger.mint(wallet.address, ethers.utils.parseEther("1000"))
    await tx.wait()
    console.log(tx)
    senderBalance = await contract.balanceOf(wallet.address)
    contractOwnerBalance = await contract.balanceOf(contractOwnerAddress)


    //Transfer 1000 DSTT Tokens to  Contract Owner
    console.log(`\nBalance of sender: ${ethers.utils.formatEther(senderBalance)} DSTT`)
    console.log(`Balance of contract owner: ${ethers.utils.formatEther(contractOwnerBalance)} DSTT`)
    console.log(`Send 1000 DSTT tokens to Contract`)
    tx = await dsttWithSinger.transfer(contractOwnerAddress, ethers.utils.parseEther("1000"))
    await tx.wait()
    console.log(tx)
    contractOwnerBalance = await contract.balanceOf(contractOwnerAddress)
    senderBalance = await contract.balanceOf(wallet.address)
    console.log(`\nBalance of sender: ${ethers.utils.formatEther(senderBalance)} DSTT`)
    console.log(`Balance of contract owner: ${ethers.utils.formatEther(contractOwnerBalance)} DSTT\n`)
}

main()