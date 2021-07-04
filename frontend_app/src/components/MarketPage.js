import React, { Fragment, useEffect, useState } from "react";
import NFTToken from "./NFTToken";
import { Grid } from "@material-ui/core";
import { fetchAllNFTTokens } from "../api";

function MarketPage() {
  const [NFTAccounts, setNFTAccounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setNFTAccounts(await fetchAllNFTTokens());
    }
    fetchData();
  }, []);

  console.log(NFTAccounts);

  return (
    <Fragment>
      <Grid container spacing={4}>
        {NFTAccounts.map((item) => (
          <Grid item md={4} ml={4}>
            <NFTToken item={item} key={item.id} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default MarketPage;
