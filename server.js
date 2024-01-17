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
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

app.post('/call_python', async (req, res) => {

    // Get the JSON body from the request
    const json_body = req.body;

    // Recover the account address from the message and signature
    const address_from_sign = recoverAccount(json_body.message, json_body.signature); // Should be 0xadaa
    console.log("The signed address: ( account who signed ): " + address_from_sign);
    const name_resolved = "0xadaaf2160f7e8717ff67131e5aa00bfd73e377d5"

    const real_address_resolved = await resolveENS('cellact.eth'); // Should be 0xc4c
    const real_address_from_sign = json_body.real_address; // Should be 0xc4c

    if (real_address_from_sign.toLowerCase() != real_address_resolved.toLowerCase()) {
        res.status(500).json({ error: 'Signature does not match ENS name' });
    }

    try {
        // Make a POST request to the Google Cloud Function
        const response = await axios.post('https://us-central1-arnacon-nl.cloudfunctions.net/server_helper_ens', { tx_hash: json_body.hash, user_address: real_address_from_sign });
        console.log(response.data);
        // Send the response data as a JSON response
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calling Google Cloud Function' });
    }


    // // Spawn a child process running the validate_user.py script
    // const pythonProcess = spawn('python3', ['./validate_user.py', json_body.hash , address]);

    // // Initialize an empty string to collect the script's output
    // let responseData = ''; // Initialize an empty string to collect the script's output

    // // Listen for data events on the python process
    // pythonProcess.stdout.on('data', (data) => {
    //   responseData += data.toString(); // Collect the script's output
    // });

    // pythonProcess.on('close', (code) => {
    //   console.log(`Python script exited with code ${code}`);
    //   // Send the collected data as a JSON response
    //   console.log(responseData);
    //   res.json({ success: true, data: responseData });
    // });
});

app.listen(3000, () => console.log('Server running on port 3000'));


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
  // Resolve the ENS name to an address
  const address = await web3.eth.ens.getAddress(ensName);
  console.log("The real resolve of ENS is: " + address);
  return address;
}
