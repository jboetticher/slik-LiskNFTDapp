import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase';
import firebaseConfig from './auth/firebaseConfig.json';
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Switch,
  Route,
} from 'react-router-dom';
import {
  Link,
  Typography,
  Container,
  Drawer,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core';
import SlikTheme from './SlikTheme.js';
import ReceiptIcon from '@material-ui/icons/Receipt';
import StorefrontIcon from '@material-ui/icons/Storefront';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';

import * as api from './api';
import { NodeInfoContext, nodeInfoContextDefaultValue, UserContext } from './context';
import { passphrase, cryptography } from "@liskhq/lisk-client";

import HomePage from './components/HomePage';
import TransactionsPage from './components/TransactionsPage';
import AccountPage from './components/AccountPage';
import MarketPage from './components/MarketPage';
import InventoryPage from './components/InventoryPage';
import CreateAccountDialog from './components/dialogs/CreateAccountDialog';
import TransferFundsDialog from './components/dialogs/TransferFundsDialog';
import CreateNFTTokenDialog from './components/dialogs/CreateNFTTokenDialog';
import FirebaseAccountDialog from './components/dialogs/FirebaseAccountDialog';

// Firebase app
var app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const drawerWidth = 240;
const useStyles = makeStyles((theme) => (
  {
    rootcontainer: {
      display: 'flex'
    },
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    contentContainer: {
      //padding: theme.spacing(5, 0),
    },
    dialog: {
      background: theme.palette.secondary.main
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      background: theme.palette.secondary.main
    },
    drawerPaper: {
      width: drawerWidth,
      background: theme.palette.secondary.main
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.primary.main,
      padding: theme.spacing(3),
    },
    menuIcon: {
      color: theme.palette.text.primary
    },
  }));



let Frame = props => {
  const classes = useStyles();

  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);


  const handleSpeedDialClose = () => {
    setOpenSpeedDial(false);
  };

  const handleSpeedDialOpen = () => {
    setOpenSpeedDial(true);
  };

  let DrawerLink = props => (
    <ListItem button component={RouterLink}
      to={props.to} variant="contained" color="primary">
      <ListItemIcon className={classes.menuIcon}>{props.icon}</ListItemIcon>
      <ListItemText primary={props.primary ?? props.text} />
    </ListItem>
  );

  return (
    <UserContext.Consumer>
      {userinfo => {
        return (
          <div className={classes.rootcontainer}>

            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
              anchor="left"
            >
              <Link component={RouterLink} to="/" variant="contained" style={{ textAlignLast: "center" }}>
                <img src="/slkLogo.svg" style={{ width: "50%", marginTop: "16px", marginBottom: "16px" }} />
              </Link>
              <Divider />
              <List>
                <DrawerLink to="/market" icon={<StorefrontIcon />} text="Market" />
                <DrawerLink to="/inventory" icon={<AssignmentTurnedInIcon />} text="Inventory" />
              </List>
              <Divider />
              <List>
                <DrawerLink to="/transactions" icon={<ReceiptIcon />} text="Transactions" />
                <ListItem button variant="contained" color="primary"
                  onClick={(e) => { setOpenDialog('FirebaseAccountDialog'); }}>
                  <ListItemIcon className={classes.menuIcon}><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItem>
              </List>
            </Drawer>

            {userinfo.user == null ? <></> :
              <SpeedDial
                ariaLabel="SpeedDial example"
                color="secondary"
                className={classes.speedDial}
                icon={<SpeedDialIcon />}
                onClose={handleSpeedDialClose}
                onOpen={handleSpeedDialOpen}
                open={openSpeedDial}
                direction={'up'}
              >
                <SpeedDialAction
                  key={'Create NFT'}
                  icon={<AddPhotoAlternateIcon />}
                  tooltipTitle={'Create NFT'}
                  onClick={() => {
                    setOpenSpeedDial(false);
                    setOpenDialog('CreateNFTTokenDialog');
                  }}
                />

                <SpeedDialAction
                  key={'Transfer'}
                  icon={<LocalAtmIcon />}
                  tooltipTitle={'Transfer Funds'}
                  onClick={() => {
                    setOpenSpeedDial(false);
                    setOpenDialog('TransferFundsDialog');
                  }}
                />
              </SpeedDial>
            }

            <Container className={classes.contentContainer}>
              <Switch>
                <Route path="/" exact>
                  <HomePage />
                </Route>
                <Route path="/accounts/:address" component={AccountPage} />
                <Route path="/transactions" component={TransactionsPage} />
                <Route path="/market" component={MarketPage} />
                <Route path="/inventory" component={InventoryPage} />
              </Switch>
            </Container>

            <CreateNFTTokenDialog
              className={classes.className}
              open={openDialog === 'CreateNFTTokenDialog'}
              handleClose={() => {
                setOpenDialog(null);
              }}
              passphrase={userinfo["key"]}
            />

            <CreateAccountDialog
              open={openDialog === 'CreateAccountDialog'}
              handleClose={() => {
                setOpenDialog(null);
              }}
            />

            <TransferFundsDialog
              open={openDialog === 'TransferFundsDialog'}
              handleClose={() => {
                setOpenDialog(null);
              }}
              address={userinfo["address"]}
            />

            <FirebaseAccountDialog
              open={openDialog == 'FirebaseAccountDialog'}
              handleClose={() => {
                setOpenDialog(null);
              }}
            />
          </div>
        )
      }}
    </UserContext.Consumer>
  );
}

function App() {
  const classes = useStyles(SlikTheme);
  const [userState, updateUserState] = useState(null);
  const [userAcc, updateUserAcc] = useState(null);
  const [nodeInfoState, updateNodeInfoState] = useState(
    nodeInfoContextDefaultValue,
  );

  firebase.auth().onAuthStateChanged((user) => {
    //console.log(user);
    updateUserState(user);
    if (user != null && userAcc == null) {
      updateUserAcc(false);
      let userDoc = db.collection("users").doc(user.uid);

      console.log("this fired", userDoc);

      userDoc.get().then((doc) => {
        if (doc.exists) {
          let docData = doc.data();
          console.log("the user doc exists", docData);
          updateUserAcc({ address: docData.address, key: docData.key });
        } else {
          console.log("a new account was made");
          const pw = passphrase.Mnemonic.generateMnemonic();
          const address = cryptography.getBase32AddressFromPassphrase(pw).toString("hex");

          db.collection("users").doc(user.uid).set({
            address: address,
            key: pw
          });
          updateUserAcc({ address: address, key: pw });
        }
      });
    }
  });

  const updateHeight = async () => {
    const info = await api.fetchNodeInfo();

    updateNodeInfoState({
      networkIdentifier: info.networkIdentifier,
      minFeePerByte: info.genesisConfig.minFeePerByte,
      height: info.height,
    });
  };

  useEffect(() => {
    async function fetchData() {
      const info = await api.fetchNodeInfo();
      updateNodeInfoState({
        networkIdentifier: info.networkIdentifier,
        minFeePerByte: info.genesisConfig.minFeePerByte,
        height: info.height,
      });
      setInterval(updateHeight, 1000);
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={SlikTheme} >
      <Fragment>
        <UserContext.Provider value={{ user: userState, address: userAcc?.address, key: userAcc?.key }}>
          <NodeInfoContext.Provider value={nodeInfoState}>
            <Router>
              <Frame />
            </Router>
          </NodeInfoContext.Provider>
        </UserContext.Provider>
      </Fragment>
    </ThemeProvider>
  );
}

export default App;
