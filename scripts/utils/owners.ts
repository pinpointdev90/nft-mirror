import { ContractCallContext, Multicall } from "ethereum-multicall";

export const getOwnersForIds = async (multicall: Multicall, ids: number[], contractAddress: string) => {
  const contractCallContext: ContractCallContext[] = [
    {
      reference: "MyNFT",
      contractAddress,
      abi: [
        {
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          name: "ownerOf",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      calls: [
        ...ids.map((id) => ({
          reference: id.toString(),
          methodName: "ownerOf",
          methodParameters: [id],
        })),
      ],
    },
  ];

  const results = await multicall.call(contractCallContext);

  const owners: { [address: string]: number[] } = {};

  results.results.MyNFT.callsReturnContext.forEach((result) => {
    const address = result.returnValues[0];
    const ownedId = Number(result.reference);

    owners[address] = owners[address] ? [...owners[address], ownedId] : [ownedId];
  });

  return owners;
};

export const aggregateOwners = (ownersList: { [address: string]: number[] }[]) => {
  const owners: { [address: string]: number[] } = {};

  ownersList.forEach((ownersInstance) => {
    Object.entries(ownersInstance).forEach((entry) => {
      const address = entry[0];
      const ownedIds = entry[1];

      owners[address] = owners[address] ? [...owners[address], ...ownedIds] : [...ownedIds];
    });
  });

  return owners;
};
