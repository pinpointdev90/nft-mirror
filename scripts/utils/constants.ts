const LIST_IDS = Array(10)
  .fill(null)
  .map((_, index) => index);

const MY_NFT_ADDRESS = "0xC81Fa2eacc1c45688d481b11CE94c24a136e125d";

const MY_MIRROR_ADDRESS = "0x00Fc6aE4a5133C2Ee0bb473Df8D6B41Fe6a6C94b";

const MIRROR_ABI = ["function setOwners(tuple(address owner, uint256[] tokenIds)[] _ownerUpdates)"];

const ETHEREUM_RPC_ENDPOINT = `https://eth-goerli.alchemyapi.io/v2/${process.env.RPC_ENDPOINT_ETHEREUM_KEY}`;

const POLYGON_RPC_ENDPOINT = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.RPC_ENDPOINT_POLYGON_KEY}`;

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export { LIST_IDS, MY_NFT_ADDRESS, MY_MIRROR_ADDRESS, MIRROR_ABI, ETHEREUM_RPC_ENDPOINT, POLYGON_RPC_ENDPOINT, PRIVATE_KEY };
