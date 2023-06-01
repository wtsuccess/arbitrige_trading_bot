const { ethers } = require('ethers');

const FactoryABI = require('./abis/UniswapV2Factory.json');
const ERC20ABI = require('./abis/ERC20.json');
const PairABI = require('./abis/UniswapV2Pair.json');

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/dfe71f1accf34773bf03c979c79c8272');

const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const factoryContract = new ethers.Contract(factoryAddress, FactoryABI, provider);

const listenEvents = async (pairAddress) => {
  try {
    const pairContract = new ethers.Contract(pairAddress, PairABI, provider);
    const token0 = await pairContract.token0();
    const token1 = await pairContract.token1();
    const contract0 = new ethers.Contract(token0, ERC20ABI, provider);
    const contract1 = new ethers.Contract(token1, ERC20ABI, provider);
    const name0 = await contract0.name();
    const name1 = await contract1.name();
    pairContract.on('Mint', async (sender, amount0, amount1, event) => {
      console.log(`Add liquidity from ${sender}`);
      console.log(`------ (${name0}/${name1})`, Number(amount0), Number(amount1));
    });
  } catch (e) {
    console.error("Err: ", "rpc is busy");
  }
}

// bind from existing pairs
const setupHookToExistingPairs = async () => {
  const pairsLength = await factoryContract.allPairsLength();
  for (let i = 25; i < pairsLength; i++) {
    const pairAddress = await factoryContract.allPairs(i);
    console.log(`[${i}] Setup connection to ${pairAddress} ...`);
    listenEvents(pairAddress);
  }
}

factoryContract.on('PairCreated', async (token0, token1, pair, pairLength, event) => {
  // Log the new pair's address and the addresses of the tokens it holds
  console.log(`New pair created: ${ pair }`);
  listenEvents(pair);
});

setupHookToExistingPairs();
