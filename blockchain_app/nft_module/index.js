const { BaseModule } = require("lisk-sdk");
const { getAllNFTTokensAsJSON } = require("./nft");

const CreateNFTAsset = require("./transactions/create_nft_asset");
const PurchaseNFTAsset = require("./transactions/purchase_nft_asset");
const TransferNFTAsset = require("./transactions/transfer_nft_asset");

// Extend base module to implement your custom module
class NFTModule extends BaseModule {
  name = "nft";
  id = 1024;

  // where we define the account schema
  accountSchema = {
    type: "object",
    required: ["ownNFTs"],
    properties: {
      ownNFTs: {
        type: "array",
        fieldNumber: 1,
        items: {
          dataType: "bytes",
        },
      },
      /*
      slikToken: {
        dataType: "uint64",
        fieldNumber: 2,
      }
      */
    },
    default: {
      ownNFTs: [],
      //slikToken: 0,
    },
  };

  // where we define the transactions (things the plugin can do)
  transactionAssets = [new CreateNFTAsset(), new PurchaseNFTAsset(), new TransferNFTAsset()];
  
  // where we define the getters
  actions = {
    // get all the registered NFT tokens from blockchain
    getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
  };
}

module.exports = { NFTModule };
