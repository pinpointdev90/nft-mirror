import { ethers } from "hardhat";

async function main() {
  const MyMirror = await ethers.getContractFactory("MyMirror");
  const myMirror = await MyMirror.deploy();

  await myMirror.deployed();

  console.log("MyMirror deployed to:", myMirror.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
