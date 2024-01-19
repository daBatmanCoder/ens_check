const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = process.env.PORT || 3000;
const ethUtil = require('ethereumjs-util');
const axios = require('axios');
const Web3 = require('web3').default;

app.use(express.json());

// Specify the list of allowed origins
const allowedOrigins = ['http://localhost:5501', 'http://127.0.0.1:5501'];
const web3 = new Web3('https://ethereum.publicnode.com');

// Use cors middleware to enable CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Enable pre-flight request for all routes
app.options('*', cors());

// Your authentication middleware (if any) should go here, after CORS configuration

app.use(express.json());

app.listen(3000, () => console.log('Server running on port 3000'));

app.post('/verify_ens', async (req, res) => {

    // Get the JSON body from the request
    const json_body = req.body;

    // Recover the account address from the message and signature
    const address_from_sign = recoverAccount(json_body.message, json_body.signature); // Should be 0xadaa
    const ens_of_user = json_body.ens; // Should be 0xadaa
    console.log(ens_of_user);
    const address_resolved = await resolveENS(ens_of_user); // Should be 0xc4c
    console.log("The resolved address is: " + address_resolved);

    if ( address_from_sign.toLowerCase() != address_resolved.toLowerCase() ){
        res.status(500).json({ error: 'Signature does not match ENS name' });
    }
    else{
      res.json({ success: true, data: "verified" });
    }

});

app.post('/call_user', async (req, res) => {

  // Get the JSON body from the request
  const json_body = req.body;

  // Recover the account address from the message and signature
  const address_from_sign = recoverAccount(json_body.message, json_body.signature); // Should be 0xadaa
  console.log("The recovered address of the signer is: " + address_from_sign);

  const tx_hash = json_body.hash; // Should be 0xadaa
  // Need to check if the owner of the NFT is the same recovered addresss


  // Need to check that the ens is still owned by the same address - that in the token URI
  const details_from_google = await get_details_from_google(tx_hash);

  const json_details = JSON.parse(details_from_google); // Details from google - ownerOf NFT and tokenURI

  const token_uri = json_details.tokenURI;
  const token_uri_json = JSON.parse(token_uri); // Token URI JSON

  const ens_of_user = token_uri_json.ens; // User ENS
  
  const address_of_nft_owner = token_uri_json.address; // User Address

  const owner_of_nft = json_details.ownerOf; // Owner of the NFT from transaction hash

  const address_resolved = await resolveENS(ens_of_user); // The owner of the ENS that in the NFT

  // To check if the ENS is still owned by the same address
  if(address_resolved.toLowerCase() != address_of_nft_owner.toLowerCase()){
    res.status(500).json({ error: 'The ENS is not longer yours' });
  }

  // To check if the signer is the owner of the NFT - application wallet
  if ( address_from_sign.toLowerCase() != owner_of_nft.toLowerCase() ){
      res.status(500).json({ error: 'Signature does not match ENS name' });
  }

  res.json({ success: true, data: "verified" });

});



// Get the details from the google function
async function get_details_from_google(tx_hash){


  const payload = {
    tx_hash: tx_hash
  };

  // Make the fetch request
  const response = await fetch('https://us-central1-arnacon-nl.cloudfunctions.net/server_helper_ens', {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
  });

  // Check if the request was successful
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const response_from_google = await response.text();
  console.log("The response from google is: " + response_from_google);
  return response_from_google;
}

function recoverAccount(message, signature) {
  const msgHash = ethUtil.hashPersonalMessage(Buffer.from(message));
  const signatureBuffer = ethUtil.toBuffer(signature);
  const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethUtil.publicToAddress(publicKey);
  const address = ethUtil.bufferToHex(addressBuffer);
  return address;
}


async function resolveENS(ensName) {
  // // Resolve the ENS name to an address
  // const address = await web3.eth.ens.getAddress(ensName);
  // console.log("The real resolve of ENS is: " + address);
  // return address;

  const address_of_ens = "";

  if (!ensName) {
    alert("Please enter an ENS name.");
    return;
  }

  try {
      // Prepare the request payload
      const payload = {
          domain: ensName
      };

      // Make the fetch request
      const response = await fetch('https://us-central1-arnacon-nl.cloudfunctions.net/server_helper_subdomains', {
          method: 'POST', // or 'GET', depending on how your server function expects to receive data
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
      });

      // Check if the request was successful
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      return responseText;

  } catch (error) {
      console.error('Error fetching subdomain data:', error);
  }
  return address_of_ens;
}

app.get('/favicon.ico', (req, res) => {
  res.status(404).send('No favicon');
});


