const { ethers } = require('ethers');
const FactoryABI = require('./abis/UniswapV2Factory.json');
const ERC20ABI = require('./abis/ERC20.json');

// Replace with your own Infura or other Ethereum node URL
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/dfe71f1accf34773bf03c979c79c8272');

// Replace with the address of the Uniswap V2 Factory contract on the Ethereum network you're using
const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

// Create a new instance of the Uniswap V2 Factory contract and attach it to the provider
const factoryContract = new ethers.Contract(factoryAddress, FactoryABI, provider);

// Listen for new pair creation events using the `PairCreated` event
factoryContract.on('PairCreated', async (token0, token1, pair, pairLength, event) => {
  // Log the new pair's address and the addresses of the tokens it holds
  console.log(`New pair created: ${ pair }`);
  const contract0 = new ethers.Contract(token0, ERC20ABI, provider);
  const contract1 = new ethers.Contract(token1, ERC20ABI, provider);
  console.log(`Token 1: ${ token0 }`, await contract0.name());
  console.log(`Token 2: ${token1}`, await contract1.name());
});