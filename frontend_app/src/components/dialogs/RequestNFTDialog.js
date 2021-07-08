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
import { transferNFT } from "../../utils/transactions/transfer_nft";
import SlikTheme, { CardTheme } from "../../SlikTheme";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiTextField-root": {
			margin: theme.spacing(1),
		},
	},
	modalTitle: {
		background: theme.palette.secondary.main,
		color: "#fff"
	}
}));

export default function RequestNFTDialog(props) {
	const nodeInfo = useContext(NodeInfoContext);
	const classes = useStyles();
	var db = firebase.firestore();

	const [data, setData] = useState({
		name: props.token.name,
		nftId: props.token.id,
		recipientAddress: "",
		fee: "",
		passphrase: "",
	});

	const handleChange = (event) => {
		event.persist();
		setData({ ...data, [event.target.name]: event.target.value });
	};

	const handleSend = async (event) => {
		event.preventDefault();

		// some firebase stuff
		db.collection("requests").doc(props.token.tokenHistory[0]).set({
            address: props.token.address,
            message: data.message,
			name: props.token.name
          });
	};

	return (
		<Fragment>
			<Dialog
				open={props.open} onBackdropClick={props.handleClose}>
				<DialogTitle className={classes.modalTitle} id="alert-dialog-title">
					{"Transfer NFT"}
				</DialogTitle>
				<DialogContent>
					<ThemeProvider theme={CardTheme}>
						<p>
							Ask the owner for/about the NFT. Perhaps you can sort out a deal?
						</p>
						<form className={classes.root} noValidate autoComplete="off">
							<TextField
								label="Message"
								value={data.message}
								name="message"
								onChange={handleChange}
								fullWidth
								multiline
							/>
						</form>
					</ThemeProvider>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSend}>Send Request</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
