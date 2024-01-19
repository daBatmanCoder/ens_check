let address_of_ens;
let ens_of_user; 
let user_connected_account;
let tx_hash;

// Load Web3
window.addEventListener('load', () => {
    // Initialize web3
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
        
    } else {
        // window.web3 = new Web3(new Web3.providers.HttpProvider("https://ethereum.publicnode.com"));
    }

    // Check MetaMask connection status on load
    checkMetaMaskConnection();
});


// Check MetaMask connection status
function checkMetaMaskConnection() {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                console.error(err);
                updateStatus('Not Connected', 'disconnected');
            });
    } else {
        updateStatus('Not Connected', 'disconnected');
    }
}


// Handle account change or initial check
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        updateStatus('Not Connected', 'disconnected');
    } else {
        user_connected_account = accounts[0];
        document.getElementById('connectButton').disabled = true;
        console.log(accounts[0]);
account_of_user = accounts[0];
        updateStatus('Connected', 'connected');
    }
}

// Update status div
function updateStatus(message, className) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = className;
}

// Connect to MetaMask
const connectButton = document.getElementById('connectButton');
connectButton.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            handleAccountsChanged(accounts);
        } catch (error) {
            console.error(error);
            updateStatus('Not Connected', 'disconnected');
        }
    } else {
        alert('MetaMask is not installed!');
    }
});





// Resolve ENS name
async function resolveENS() {

    let ensName = document.getElementById('ensName').value;
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
        console.log(responseText)
        ens_of_user = ensName;
        address_of_ens = responseText;
        enableTransactionButton(address_of_ens); 
        document.getElementById('resultENS').innerText = 'Address: ' + address_of_ens;

    } catch (error) {
        console.error('Error fetching subdomain data:', error);
    }
}


function enableTransactionButton(ensAddress) {
    const signButton = document.getElementById('signButton');
    window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
            
            ensAddress = ensAddress.toLowerCase();
            
            if (accounts[0] === ensAddress) {
                signButton.disabled = false;
            } else {
                alert("The ENS name does not match the connected MetaMask account.");
                signButton.disabled = true;
            }
        })
        .catch(err => console.error(err));
}


async function switchToMumbai() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // 0x13881 is the chain ID for Mumbai testnet in hexadecimal
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x13881',
                        rpcUrl: 'https://polygon-mumbai-bor.publicnode.com' // Add other chain parameters as required
                    }],
                });
            } catch (addError) {
                // Handle adding chain error
                console.error(addError);
            }
        }
        // Handle other errors
        console.error(switchError);
    }
}

const signButton = document.getElementById('signButton');
signButton.addEventListener('click', async () => {
    if (!window.ethereum) {
        return alert('MetaMask is not installed!');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const message = "I confirm that I am the owner of the NFT";
    const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
    });

    const jsonObject = JSON.stringify({ 'message':message, 'signature': signature,'hash': tx_hash, 'ens': ens_of_user });
    console.log(jsonObject);

    fetch('http://localhost:3000/verify_ens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonObject,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success && data.data === "verified") {
            document.getElementById("transactionButton").disabled = false;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // const hey = web3.eth.accounts.recover(message, signature).then(function(result) {console.log(result);})

});

async function mintNFT() {

    const contractAddress = '0x30B9a25E4b88CF8A258CE1910827e3B7957b4ce2'; // Replace with your contract address

    const abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_valueForRegisterInNetwork",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_fromTokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_toTokenId",
                    "type": "uint256"
                }
            ],
            "name": "BatchMetadataUpdate",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_newAmountToChange",
                    "type": "uint256"
                }
            ],
            "name": "changeAmountOfSender",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "MetadataUpdate",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_userDetails",
                    "type": "string"
                }
            ],
            "name": "safeMint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    
    await switchToMumbai();

    // Create a new contract instance with the contract address and ABI
    const contract = new web3.eth.Contract(abi, contractAddress);
    const valueToSend = web3.utils.toWei("0.00001", "ether"); 
    const wallet_app = "0x9e1611a42DA718FB14eCdE3fE6eba3Bb5B97F77B";
    const tokenURI = {'ens': ens_of_user, 'address': address_of_ens}
    const stringToken = JSON.stringify(tokenURI);
    console.log(stringToken);

    try {

        // Send transaction
        await contract.methods.safeMint(wallet_app, stringToken).send({from: user_connected_account, value: valueToSend })
        .on('transactionHash', function(hash){
            tx_hash = hash;
            // Transaction hash received
            console.log('Transaction hash:', hash);

        })
        .on('confirmation', function(confirmationNumber, receipt){
        })
        .on('receipt', function(receipt){
            console.log(receipt);
            document.getElementById('callButtonTB').disabled = false;
            document.getElementById('callButton').disabled = false;
        })
        .on('error', console.error); // If there's an error
        
    } catch (error) {
        console.error('Transaction error:', error);
    }
}


const callButton = document.getElementById('callButton');
callButton.addEventListener('click', async () => {
    const user_to_call = document.getElementById("callButtonTB").value;
    console.log(user_to_call);

    if (!window.ethereum) {
        return alert('MetaMask is not installed!');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const message = "I want to call: " + user_to_call;
    const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
    });

    const jsonObject = JSON.stringify({ 'message':message, 'signature': signature,'hash': tx_hash});
    console.log(jsonObject);

    fetch('http://localhost:3000/call_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonObject,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success && data.data === "verified") {
            document.getElementById("resultCalling").innerText = "Calling: " + user_to_call;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

});