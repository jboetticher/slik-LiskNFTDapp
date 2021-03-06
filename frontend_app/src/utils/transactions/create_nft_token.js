/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const createNFTTokenSchema = {
  $id: "lisk/create-nft-asset",
  type: "object",
  required: ["minPurchaseMargin", "initValue", "name", "content"],
  properties: {
    minPurchaseMargin: {
      dataType: "uint32",
      fieldNumber: 1,
    },
    initValue: {
      dataType: "uint64",
      fieldNumber: 2,
    },
    name: {
      dataType: "string",
      fieldNumber: 3,
    },
    content: {
      dataType: "string",
      fieldNumber: 4,
    }
  },
};

export const createNFTToken = async ({
  name,
  initValue,
  minPurchaseMargin,
  passphrase,
  content,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

  console.log("public key:", publicKey);
  console.log("address:", address);

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);

  const { id, ...rest } = transactions.signTransaction(
    createNFTTokenSchema,
    {
      moduleID: 1024,
      assetID: 0,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        content,
        initValue: BigInt(transactions.convertLSKToBeddows(initValue)),
        minPurchaseMargin: parseInt(minPurchaseMargin),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createNFTTokenSchema), rest),
    minFee: calcMinTxFee(createNFTTokenSchema, minFeePerByte, rest),
  };
};
