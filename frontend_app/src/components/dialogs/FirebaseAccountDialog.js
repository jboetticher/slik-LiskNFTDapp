import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { CardTheme } from "../../SlikTheme";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { NodeInfoContext, UserContext } from "../../context";
import { createNFTToken } from "../../utils/transactions/create_nft_token";
import firebase from "firebase";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  modalTitle: {
    background: theme.palette.secondary.main
  }
}));

/**
 * NOTES:
 * If you push this to production, you're going to want some sort of CAPTCHA
 * on your registration. Currently, you can be spammed with accounts, which will
 * rack up quite the penny on your firebase if you're not careful.
 */

export default function FirebaseAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
      .then(userCredential => {

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error! Code: " + errorCode + ". Message: " + errorMessage);
      });

    props.handleClose();
  };

  const handleLogin = async (event) => {
    firebase.auth().signInWithEmailAndPassword(data.email, data.password)
      .then((userCredential) => {
        var user = userCredential.user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error! Code: " + errorCode + ". Message: " + errorMessage);
      });
  }

  const handleSignOut = async (event) => {
    firebase.auth().signOut();
  }

  return (
    <Fragment>
      <UserContext.Consumer>
        {value => {
          return (
            <Dialog
              open={props.open}
              onBackdropClick={props.handleClose}>
              <DialogTitle className={classes.modalTitle} id="alert-dialog-title">{"Login / Register"}</DialogTitle>
              <DialogContent>
                <ThemeProvider theme={CardTheme}>
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      label="Email"
                      value={data.email}
                      name="email"
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      value={data.password}
                      name="password"
                      type="password"
                      onChange={handleChange}
                      fullWidth
                    />
                  </form>
                </ThemeProvider>
              </DialogContent>
              <DialogActions>
                {value?.user ?
                  <Button color="primary" onClick={handleSignOut}>Sign Out</Button> :
                  <>
                    <Button color="primary" onClick={handleLogin}>Login</Button>
                    <Button color="primary" onClick={handleSend}>Create Account</Button>
                  </>
                }
              </DialogActions>
            </Dialog>
          );
        }}
      </UserContext.Consumer>
    </Fragment>
  );
}
