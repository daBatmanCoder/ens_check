window.addEventListener('load', () => {
    // Initialize web3
    // if (typeof web3 !== 'undefined') {
        // window.web3 = new Web3(web3.currentProvider);
    // } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://ethereum.publicnode.com"));
    // }

    // Check MetaMask connection status on load
    // checkMetaMaskConnection();
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

function resolveENS() {
    let ensName = document.getElementById('ensName').value;
    if (!ensName) {
        alert("Please enter an ENS name.");
        return;
    }

    web3.eth.ens.getAddress(ensName).then(function(address) {
        document.getElementById('result').innerText = 'Address: ' + address;
        console.log(address);
        address = "0xADaAf2160f7E8717FF67131E5AA00BfD73e377d5";
        enableTransactionButton(address); // Enable transaction button if ENS matches
    }).catch(function(error) {
        document.getElementById('result').innerText = 'Error: ' + error.message;
    });
}

function enableTransactionButton(ensAddress) {
    const transactionButton = document.getElementById('transactionButton');
    window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
            
            ensAddress = ensAddress.toLowerCase();
            accounts[0] = ensAddress.toLowerCase();
            console.log(accounts[0]);
            console.log(ensAddress);
            
            if (accounts[0] === ensAddress) {
                transactionButton.disabled = false;
            } else {
                alert("The ENS name does not match the connected MetaMask account.");
                transactionButton.disabled = true;
            }
        })
        .catch(err => console.error(err));
}



