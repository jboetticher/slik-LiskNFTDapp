import React, { Fragment, useEffect, useState } from "react";
import { ThemeProvider, Typography, Card, CardContent, CardHeader } from "@material-ui/core";
import { fetchAllNFTTokens } from "../api";
import SlikTheme from '../SlikTheme';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
	frontPageCard: {
    background: theme.palette.primary.main,
    marginTop: '24px'
  }
}));

function HomePage() {
  const [NFTAccounts, setNFTAccounts] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      setNFTAccounts(await fetchAllNFTTokens());
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={SlikTheme}>
      <Card className={classes.frontPageCard}>
        <CardContent>
          <img src="/slkLogo.svg" style={{width: "50%", margin: "auto", left: "25%", position: "relative"}} />
          <Typography align="center" style={{marginTop: "16px"}}>
            A new NFT marketplace made for the Lisk ecosystem.
          </Typography>
          <Typography style={{marginTop: '16px'}}>
            NFTs have a problem: there's no point to trading them around. Who wants to buy a hastily made meme
            for 400 dollars? It's not like you can do anything with it. Fortunately, Slik NFTs have trade and
            purchase rewards, allowing you to level up NFTs, increasing their value over time. This makes Slik 
            NFTs cooler, one could even say... <i>slicker</i>. 
          </Typography>
          <Typography style={{marginTop: '16px'}}>
            Now go forth: level up your NFTs, earn SLK, and expand your collection!
          </Typography>
        </CardContent>
      </Card>
      <Card className={classes.frontPageCard}>
        <CardHeader title="How Do I Start?" />
        <CardContent>
          <Typography>
            Start by making an account in the left side panel. This will generate a wallet to hold all of your 
            NFTs. Don't worry, you'll be able to move all of your NFTs to another wallet once you start trading, 
            purchasing, and minting them. 
          </Typography>
          <Typography>
            Get started by sending some Lisk to your account's wallet. This way you can start minting and 
            purchasing NFTs.
          </Typography>
          <Typography style={{marginTop: "16px"}}>
            Be warned! Slik's account system is currently centralized. There is no extension similar to metamask 
            for Lisk yet, so <b>do not send too much Lisk to your account wallet!</b>
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default HomePage;
