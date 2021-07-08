# SLIK: Lisk NFT Dapp

This project is very similar to the NFT Demo app, so instructions will be very similar.

This is a NFT Blockchain application created using `Version 5` of `lisk-sdk`.

- A blockchain app which have support for.
  - NFT Token
    - It has an initial value
    - It has a purchase margin for auto purchase
    - It has only one owner at a time
    - Metadata for each NFT
    - Purchase margin can be set to zero meant non-purchasable
    - Anyone can create a non-fungible token if he has enough balance
    - Owner can transfer token to someone without any profit
    - Anyone can purchase a NFT if satisfy given purchase margin
    - NFT experience & leveling
- List of available Non-Fungible Tokens should be accessible

## Install dependencies

```bash
cd blockchain_app && npm i --registry https://npm.lisk.io
cd frontend_app && npm i --registry https://npm.lisk.io
```

## Set Up Auth
You need to set up the authorization of the application so that it works for firebase. Create an "auth" folder within the frontend's "src" folder,
and insert a `firebaseConfig.json` from your firebase project.  
If you don't have a firebase project, you can use my config:  
```
{
	"apiKey": "AIzaSyBuJozzlKpejlDot0CCPxI6qMP4Nt2PQvU",
	"authDomain": "slik-dev.firebaseapp.com",
	"projectId": "slik-dev",
	"storageBucket": "slik-dev.appspot.com",
	"messagingSenderId": "886037776247",
	"appId": "1:886037776247:web:a08fedf4376f79f3614372",
	"measurementId": "G-T7WBZR6BK0"
}
```

## Start node

```bash
cd blockchain_app; node index.js
```

## Start frontend

```bash
cd frontend_app; npm start
```

### Test NFT Creation

Follow these steps to test it:

1. Create an account from the left menu.
2. Now choose second option from the bottom right speed dial and transfer funds to that account. You can use genesis account passphrase for it.
3. Create NFT in the form from the other speed dial option.

