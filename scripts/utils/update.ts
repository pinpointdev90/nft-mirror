import { ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { MY_MIRROR_ADDRESS, MIRROR_ABI, PRIVATE_KEY } from "./constants";
import * as fs from "fs";

export const sendOwnerUpdates = async (provider: ethers.providers.JsonRpcProvider, ownerUpdates: { owner: string; tokenIds: number[] }[]) => {
  const contract = new ethers.Contract(MY_MIRROR_ADDRESS, MIRROR_ABI, provider);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const myMirror = contract.connect(wallet);

  if (!process.env.CI) {
    fs.writeFileSync(`./output/ownerUpdates-${Date.now()}.json`, JSON.stringify(ownerUpdates, null, 2), "utf8");
  }

  if (process.env.CI) {
    if (ownerUpdates.length > 0) {
      console.log("sending tx to MyMirror");

      const options = {
        gasLimit: 10_000_000,
        gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
      };

      try {
        const tx = await myMirror.setOwners(ownerUpdates, options);
        console.log(`tx sent: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`status: ${receipt.status}`);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
