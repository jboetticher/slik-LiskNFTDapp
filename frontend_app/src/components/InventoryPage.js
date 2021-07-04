import React, { Fragment, useEffect, useState } from "react";
import NFTToken from "./NFTToken";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { fetchAllNFTTokens } from "../api";
import { UserContext } from "../context";

const useStyles = makeStyles((theme) => ({
  frontPageCard: {
    background: theme.palette.primary.main,
    marginTop: '24px'
  }
}));

function InventoryPage() {
  const [NFTAccounts, setNFTAccounts] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      setNFTAccounts(await fetchAllNFTTokens());
    }
    fetchData();
  }, []);

  console.log(NFTAccounts);

  return (
    <UserContext.Consumer>
			{userinfo => {console.log(userinfo); return(
      <Fragment>
        <Card className={classes.frontPageCard}>
          <CardContent>
            <Typography align="center" style={{ marginTop: "16px" }}>
              Your NFT Inventory
            </Typography>
            <Typography style={{ marginTop: '16px' }}>
              This is your inventory, where all of your NFTs are displayed. Sit here and gawk in awe
              at how slick they are, or manage them independently.
            </Typography>
          </CardContent>
        </Card>
        <Grid container spacing={4}>
          {NFTAccounts.map((item) => (
            item.tokenHistory[0] != userinfo.address ? <></> :
            <Grid item md={4} ml={4}>
              <NFTToken item={item} key={item.id} />
            </Grid>
          ))}
        </Grid>
      </Fragment>
      )}}
    </UserContext.Consumer>
  );
}

export default InventoryPage;
