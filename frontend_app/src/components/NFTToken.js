import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link,
  Divider,
  Button,
  Slider,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { UserContext } from "../context";
import { transactions, cryptography, Buffer } from "@liskhq/lisk-client";
import { CardTheme, Colors } from '../SlikTheme';

import PurchaseNFTTokenDialog from "./dialogs/PurchaseNFTTokenDialog";
import TransferNFTDialog from "./dialogs/TransferNFTDialog";
import RequestNFTDialog from "./dialogs/RequestNFTDialog";

const useStyles = makeStyles((theme) => ({
  propertyList: {
    listStyle: "none",
    margin: "inherit",

    "& li": {
      display: "flex",
      paddingLeft: "8px",
      paddingRight: "8px",

      "& dt": {
        display: "block",
        width: "100%",
        flexGrow: "1",
        fontWeight: "bold",
        fontSize: "14px",
      },
      "& dd": {
        display: "block",
        fontSize: "14px",
      },
    },
  },
  tinySvg: {
    marginLeft: "4px",
    height: "16px",
    width: "16px"
  },
  barOrdinary: {
    backgroundColor: Colors.ordinary
  },
  barRare: {
    backgroundColor: Colors.rare
  },
  barEpic: {
    backgroundColor: Colors.epic
  },
  barLegendary: {
    backgroundColor: Colors.legendary,
  },
  barMythic: {
    backgroundColor: Colors.mythic
  },
  barBackLegendary: {
    backgroundColor: Colors.ordinaryBack,
  },
}));

let XPSlider = props => {
  const classes = useStyles();

  const slikXp = props.slikXp;
  let slikMax = 20;
  let barPrimaryClass = classes.barOrdinary;
  if (slikXp < 20) { barPrimaryClass = classes.barOrdinary; slikMax = 20; }
  else if (slikXp < 50) { barPrimaryClass = classes.barRare; slikMax = 50; }
  else if (slikXp < 100) { barPrimaryClass = classes.barEpic; slikMax = 100; }
  else if (slikXp < 1000) { barPrimaryClass = classes.barLegendary; slikMax = 1000; }
  else barPrimaryClass = classes.barMythic;

  const slikShow = (slikXp / slikMax) * 100;

  return (
    <>
      <LinearProgress
        value={slikShow} variant="determinate"
        classes={{ colorPrimary: classes.barBackLegendary, barColorPrimary: barPrimaryClass }}
        style={{ height: "22px", boxShadow: "0px 2px 2px rgb(0 0 0 / 60%)" }}
      />
      <div
        style={{
          position: "relative",
          top: "-19px",
          marginBottom: "-19px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", bottom: "1px" }}>{slikXp}</div>
        <img className={classes.tinySvg} src="/slk.svg" />
      </div>
    </>
  );
};

export default function NFTToken(props) {
  const classes = useStyles();
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openRequest, setOpenRequest] = useState(false);
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');

  const contentURL =
    props.item.content != "" ? props.item.content :
      "https://artlords-artwork.s3.amazonaws.com/uploads/image/7918/display_dark_souls_cinematic_3_1200w.jpg";

  return (
    <UserContext.Consumer>
      {user => (
        <ThemeProvider theme={CardTheme}>
          <Card className="card" style={{ marginTop: '24px' }}>
            <CardContent style={{ padding: '0px' }}>
              <div className="cardImage" style={{
                background: `url(${contentURL})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
              }}
              />
              <XPSlider slikXp={props.item.slikXp} />
              <div style={{ marginTop: "4px" }} />
              <Typography variant="h6" align="center">
                {props.item.name}
              </Typography>
              <dl className={classes.propertyList}>
                <li>
                  <dt>Price:</dt>
                  <dd>{transactions.convertBeddowsToLSK(props.item.value)}</dd>
                  <img className={classes.tinySvg} src="/lsk.svg" />
                </li>
                <li>
                  <dt>Margin:</dt>
                  <dd>{props.item.minPurchaseMargin}%</dd>
                  <img className={classes.tinySvg} src="/lsk.svg" />
                </li>
              </dl>
            </CardContent>
            <CardActions style={{ marginTop: "16px" }}>
              {// if the account is the current owner
                props.item.tokenHistory[0] != user.address ? <></> :
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        setOpenTransfer(true);
                      }}
                    >
                      Transfer
                    </Button>
                    <TransferNFTDialog
                      open={openTransfer}
                      handleClose={() => {
                        setOpenTransfer(false);
                      }}
                      token={props.item}
                    />
                  </>
              }
              {// if it can be purchased
                props.item.minPurchaseMargin > 0 && props.item.tokenHistory[0] != user.address ? (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        setOpenPurchase(true);
                      }}
                    >
                      Purchase
                    </Button>
                    <PurchaseNFTTokenDialog
                      open={openPurchase}
                      handleClose={() => {
                        setOpenPurchase(false);
                      }}
                      token={props.item}
                    />
                  </>
                ) : props.item.tokenHistory[0] != user.address ? (
                  <>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        setOpenRequest(true);
                      }}
                    >
                      Request
                    </Button>
                    <RequestNFTDialog
                      open={openRequest}
                      handleClose={() => {
                        setOpenRequest(false);
                      }}
                      token={props.item}
                    />
                  </>
                ) : <></>
                }
            </CardActions>
          </Card>
        </ThemeProvider>
      )}
    </UserContext.Consumer>
  );
}
