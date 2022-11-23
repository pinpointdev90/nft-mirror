import { ethers } from "hardhat";
import { uniq } from "lodash";
import { Multicall } from "ethereum-multicall";
import { LIST_IDS, MY_NFT_ADDRESS, MY_MIRROR_ADDRESS, ETHEREUM_RPC_ENDPOINT, POLYGON_RPC_ENDPOINT } from "./utils/constants";
import { getOwnersForIds } from "./utils/owners";
import { sendOwnerUpdates } from "./utils/update";

async function main() {
  const ethereumProvider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_ENDPOINT);
  const polygonProvider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_ENDPOINT);

  const ethereumMulticall = new Multicall({ ethersProvider: ethereumProvider, tryAggregate: true });
  const polygonMulticall = new Multicall({ ethersProvider: polygonProvider, tryAggregate: true });

  const mainOwners = await getOwnersForIds(ethereumMulticall, LIST_IDS, MY_NFT_ADDRESS);
  const mirrorOwners = await getOwnersForIds(polygonMulticall, LIST_IDS, MY_MIRROR_ADDRESS);

  // console.log(mainOwners);
  // console.log(mirrorOwners);

  const addressesToUpdate: string[] = [];

  Object.keys(mainOwners).forEach((address) => {
    if (address == "undefined") {
      return;
    }

    const mainTokens = mainOwners[address] || [];
    const mirrorTokens = mirrorOwners[address] || [];

    if (mainTokens && !mirrorTokens) {
      addressesToUpdate.push(address);
      console.log(`${address}: missing all tokens`);
      return;
    }

    const tokensMissingFromMirror = mainTokens.filter((id) => !mirrorTokens.includes(id)).length;
    const tokensIncorrectlyInMirror = mirrorTokens.filter((id) => !mainTokens.includes(id)).length;

    if (tokensMissingFromMirror) {
      addressesToUpdate.push(address);
      console.log(`${address}: missing ${tokensMissingFromMirror} tokens`);
    }

    if (tokensIncorrectlyInMirror) {
      addressesToUpdate.push(address);
      console.log(`${address}: found ${tokensIncorrectlyInMirror} incorrect tokens`);
    }
  });

  Object.keys(mirrorOwners).forEach((address) => {
    if (address == "undefined") {
      return;
    }

    const mainTokens = mainOwners[address] || [];
    const mirrorTokens = mirrorOwners[address] || [];

    if (mirrorTokens && !mainTokens) {
      addressesToUpdate.push(address);
      console.log(`${address}: found tokens for non-owner`);
    }
  });

  const uniqueAddresses = uniq(addressesToUpdate);

  console.log(`found ${uniqueAddresses.length} addresses to update`);

  const ownerUpdates = uniqueAddresses
    .map((address: string) => ({
      owner: address,
      tokenIds: mainOwners[address] || [],
    }))
    // could be 100s of updates, let's send 100 and pick up the rest next time
    .slice(0, 100);

  console.log(`prepared ${ownerUpdates.length} owner updates`);

  await sendOwnerUpdates(polygonProvider, ownerUpdates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
