const { codec, cryptography } = require("lisk-sdk");

// Defines how NFTs are saved on the blockchain.
const slikNFTSchema = {
  $id: "lisk/nft/registeredTokens",
  type: "object",
  required: ["slikNFT"],
  properties: {
    slikNFT: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ["id", "value", "ownerAddress", "minPurchaseMargin", "name"],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          value: {
            dataType: "uint64",
            fieldNumber: 2,
          },
          ownerAddress: {
            dataType: "bytes",
            fieldNumber: 3,
          },
          minPurchaseMargin: {
            dataType: "uint32",
            fieldNumber: 4,
          },
          name: {
            dataType: "string",
            fieldNumber: 5,
          },
          content: {
            dataType: "string",
            fieldNumber: 6,
          },
          slikXp: {
            dataType: "uint32",
            fieldNumber: 7,
          }
        },
      },
    },
  },
};

const CHAIN_STATE_NFT_TOKENS = "nft:slikNFT";

// Creates a new NFT
const createNFTToken = ({ name, content, ownerAddress, nonce, value, minPurchaseMargin }) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([ownerAddress, nonceBuffer]);
  const id = cryptography.hash(seed);
  const slikXp = 0;

  return {
    id,
    minPurchaseMargin,
    name,
    content,
    ownerAddress,
    value,
    slikXp
  };
};

// Retrieves all saved NFTs on the blockchain
const getAllNFTTokens = async (stateStore) => {
  const registeredTokensBuffer = await stateStore.chain.get(
    CHAIN_STATE_NFT_TOKENS
  );
  if (!registeredTokensBuffer) {
    return [];
  }

  const registeredTokens = codec.decode(
    slikNFTSchema,
    registeredTokensBuffer
  );

  return registeredTokens.slikNFT;
};

// Retrieves all saved NFTs on the blockchain as a JSON
const getAllNFTTokensAsJSON = async (dataAccess) => {
  const registeredTokensBuffer = await dataAccess.getChainState(
    CHAIN_STATE_NFT_TOKENS
  );

  if (!registeredTokensBuffer) {
    return [];
  }

  const registeredTokens = codec.decode(
    slikNFTSchema,
    registeredTokensBuffer
  );

  return codec.toJSON(slikNFTSchema, registeredTokens)
    .slikNFT;
};

// Saves provided NFTs to the blockchain
const setAllNFTTokens = async (stateStore, NFTTokens) => {
  const registeredTokens = {
    slikNFT: NFTTokens.sort((a, b) => a.id.compare(b.id)),
  };

  await stateStore.chain.set(
    CHAIN_STATE_NFT_TOKENS,
    codec.encode(slikNFTSchema, registeredTokens)
  );
};

module.exports = {
  slikNFTSchema,
  CHAIN_STATE_NFT_TOKENS,
  getAllNFTTokens,
  setAllNFTTokens,
  getAllNFTTokensAsJSON,
  createNFTToken,
};
