import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Input
} from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { NodeInfoContext, UserContext } from "../../context";
import { createNFTToken } from "../../utils/transactions/create_nft_token";
import * as api from "../../api";
import { CardTheme } from "../../SlikTheme";
import firebase from 'firebase';

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

export default function CreateNFTTokenDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    name: "",
    initValue: "",
    minPurchaseMargin: "",
    fee: "",
    nftimage: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.files[0] });
  }

  const handleSend = async (event) => {
    event.preventDefault();

    // upload image...
    // Create a root reference
    let userId = firebase.auth().currentUser.uid;
    let storageRef = firebase.storage().ref();

    // @TODO: Change the nft image to a serial code. 
    // Alternatively, change to a cloud function but that costs money

    // gotta store this as a proper photo
    const newImagePath = `${userId}/nft/${data.nftimage.name}`;
    console.log("Image data:", data.nftimage);
    console.log("New Image Path:", newImagePath);
    let newImageUpload = storageRef.child(newImagePath).put(data.nftimage);

    newImageUpload.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        alert("An error occurred with the upload! No NFT created.");
      },
      async function f() {
        console.log("Upload successful!");

        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        newImageUpload.snapshot.ref.getDownloadURL().then(async function dnld(downloadURL) {

          console.log("Download URL: ", downloadURL);

          // write to the blockchain
          console.log("Writing to blockchain:", data);
          try {
            const res = await createNFTToken({
              name: data.name,
              initValue: data.initValue,
              minPurchaseMargin: data.minPurchaseMargin,
              content: downloadURL,
              fee: data.fee,
              passphrase: props.passphrase,
              networkIdentifier: nodeInfo.networkIdentifier,
              minFeePerByte: nodeInfo.minFeePerByte,
            });
            await api.sendTransactions(res.tx);
            console.log('NFT available at', downloadURL, res);
          }
          catch(e) {
            console.log(e);
            alert("An error occurred on the blockchain side. Are you sure you have enough lisk?");
          }
        });
      }
    );

    props.handleClose();
  };



  return (
    <Fragment>
      <Dialog
        open={props.open}
        onBackdropClick={props.handleClose}>
        <DialogTitle className={classes.modalTitle} id="alert-dialog-title">{"Create NFT"}</DialogTitle>
        <ThemeProvider theme={CardTheme}>
          <DialogContent>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                label="Name"
                required
                value={data.name}
                name="name"
                onChange={handleChange}
                fullWidth
              />
              <Button
                variant="contained"
                component="label"
              >
                Upload NFT Image*
                  <input
                  type="file"
                  hidden
                  required
                  name="nftimage"
                  onChange={handleFileChange}
                />
              </Button>
              <TextField
                label="Initial Token value"
                value={data.initValue}
                required
                name="initValue"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Minimum Purchase Margin (0 - 100)"
                value={data.minPurchaseMargin}
                name="minPurchaseMargin"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Fee (Greater than 1)"
                value={data.fee}
                name="fee"
                onChange={handleChange}
                fullWidth
                required
              />
            </form>
          </DialogContent>
        </ThemeProvider>
        <DialogActions>
          <Button color="primary" onClick={handleSend}>Create NFT</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
