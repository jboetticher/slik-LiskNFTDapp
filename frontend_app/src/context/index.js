/* global BigInt */

import React from "react";

export const nodeInfoContextDefaultValue = { networkIdentifier: "", genesisConfig: { minFeePerByte: BigInt(0) }, height: 0 };
export const NodeInfoContext = React.createContext({ ...nodeInfoContextDefaultValue });

export const UserContext = React.createContext({ user: null, address: null, key: null });
