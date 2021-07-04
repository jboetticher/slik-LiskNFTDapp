import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { transfer } from "../../utils/transactions/transfer";
import * as api from "../../api";
import { CardTheme } from "../../SlikTheme";

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

export default function TransferFundsDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    recipientAddress: "",
    passphrase: "",
    amount: "",
    fee: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();
    console.log("Address:", props.address);

    const res = await transfer({
      ...data,
      recipientAddress: props.address,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose();
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle className={classes.modalTitle} id="alert-dialog-title">{"Transfer Funds"}</DialogTitle>
        <ThemeProvider theme={CardTheme}>
          <DialogContent>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                label="Amount"
                value={data.amount}
                name="amount"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Fee"
                value={data.fee}
                name="fee"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Passphrase"
                value={data.passphrase}
                name="passphrase"
                onChange={handleChange}
                fullWidth
              />

              <Button
                onClick={() => {
                  setData({
                    ...data,
                    passphrase:
                      "peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready",
                  });
                }}
              >
                Use Genesis Account
            </Button>
            </form>
          </DialogContent>
        </ThemeProvider>
        <DialogActions>
          <Button color="primary" onClick={handleSend}>Send Funds</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

