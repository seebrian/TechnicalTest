const { ethers } = require("ethers")

require("dotenv").config();
const { pbkdf2 } = require("@ethersproject/pbkdf2");
const { randomBytes } = require("@ethersproject/random");
const provider = new ethers.providers.JsonRpcProvider(process.env.jsonrpc)

const DSTT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function mint(address to, uint256 amount)",
    "function transfer(address to, uint amount) returns (bool)",
];

const main = async () => {
    //1. Randomly generate the seed to create an account

    //using Password-Based Key Derivation Function 2 
    //(a) radom generate entropy instead of using fixed mnemonic phase
    let entropy = randomBytes(16);
    //(b) salt
    const salt = ethers.utils.toUtf8Bytes("mnemonic" + '', ethers.utils.UnicodeNormalizationForm.NFKD);
    //(c) number of iterations
    const iterations = 2048
    //(d) key length
    const keyLength = 64
    //(e) hash algorithm
    const hashAlgorithm = "sha512"

    const seed = pbkdf2(entropy, salt, iterations, keyLength, hashAlgorithm);
    let walletFromSeed = ethers.utils.HDNode.fromSeed(seed)
    console.log(`random seed: ${seed}`)
    console.log(walletFromSeed.address)

    //2.  generate 2 other accounts with the same seed (each should have their unique index) 
    //unable to implementment without using default HD, just share my idea
    //The above seed is used to get master key for a hierarchical wallet, master key derived from the above seed, 
    //and call PBKDF2 function to generate again from this key, derive many different child keys
}

main()