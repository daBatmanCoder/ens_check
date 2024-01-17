from web3 import Web3
from eth_utils import decode_hex
import json
import sys

if len(sys.argv) < 2:
    print("Error: No data received")
    sys.exit(1)

json_body_as_string = sys.argv[1]
print(json_body_as_string)
print("hey")


# # File paths
# contract_abi = [
#     {
#         "inputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "_valueForRegisterInNetwork",
#                 "type": "uint256"
#             }
#         ],
#         "stateMutability": "nonpayable",
#         "type": "constructor"
#     },
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "owner",
#                 "type": "address"
#             },
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "approved",
#                 "type": "address"
#             },
#             {
#                 "indexed": True,
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "Approval",
#         "type": "event"
#     },
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "owner",
#                 "type": "address"
#             },
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "operator",
#                 "type": "address"
#             },
#             {
#                 "indexed": False,
#                 "internalType": "bool",
#                 "name": "approved",
#                 "type": "bool"
#             }
#         ],
#         "name": "ApprovalForAll",
#         "type": "event"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "to",
#                 "type": "address"
#             },
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "approve",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": False,
#                 "internalType": "uint256",
#                 "name": "_fromTokenId",
#                 "type": "uint256"
#             },
#             {
#                 "indexed": False,
#                 "internalType": "uint256",
#                 "name": "_toTokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "BatchMetadataUpdate",
#         "type": "event"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "burn",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "_newAmountToChange",
#                 "type": "uint256"
#             }
#         ],
#         "name": "changeAmountOfSender",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": False,
#                 "internalType": "uint256",
#                 "name": "_tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "MetadataUpdate",
#         "type": "event"
#     },
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "previousOwner",
#                 "type": "address"
#             },
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "newOwner",
#                 "type": "address"
#             }
#         ],
#         "name": "OwnershipTransferred",
#         "type": "event"
#     },
#     {
#         "inputs": [],
#         "name": "renounceOwnership",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "to",
#                 "type": "address"
#             },
#             {
#                 "internalType": "string",
#                 "name": "_userDetails",
#                 "type": "string"
#             }
#         ],
#         "name": "safeMint",
#         "outputs": [],
#         "stateMutability": "payable",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "from",
#                 "type": "address"
#             },
#             {
#                 "internalType": "address",
#                 "name": "to",
#                 "type": "address"
#             },
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "safeTransferFrom",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "from",
#                 "type": "address"
#             },
#             {
#                 "internalType": "address",
#                 "name": "to",
#                 "type": "address"
#             },
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             },
#             {
#                 "internalType": "bytes",
#                 "name": "data",
#                 "type": "bytes"
#             }
#         ],
#         "name": "safeTransferFrom",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "operator",
#                 "type": "address"
#             },
#             {
#                 "internalType": "bool",
#                 "name": "approved",
#                 "type": "bool"
#             }
#         ],
#         "name": "setApprovalForAll",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "from",
#                 "type": "address"
#             },
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "to",
#                 "type": "address"
#             },
#             {
#                 "indexed": True,
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "Transfer",
#         "type": "event"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "from",
#                 "type": "address"
#             },
#             {
#                 "internalType": "address",
#                 "name": "to",
#                 "type": "address"
#             },
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "transferFrom",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "newOwner",
#                 "type": "address"
#             }
#         ],
#         "name": "transferOwnership",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "inputs": [],
#         "name": "withdraw",
#         "outputs": [],
#         "stateMutability": "nonpayable",
#         "type": "function"
#     },
#     {
#         "stateMutability": "payable",
#         "type": "receive"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "owner",
#                 "type": "address"
#             }
#         ],
#         "name": "balanceOf",
#         "outputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "",
#                 "type": "uint256"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "getApproved",
#         "outputs": [
#             {
#                 "internalType": "address",
#                 "name": "",
#                 "type": "address"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "address",
#                 "name": "owner",
#                 "type": "address"
#             },
#             {
#                 "internalType": "address",
#                 "name": "operator",
#                 "type": "address"
#             }
#         ],
#         "name": "isApprovedForAll",
#         "outputs": [
#             {
#                 "internalType": "bool",
#                 "name": "",
#                 "type": "bool"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [],
#         "name": "name",
#         "outputs": [
#             {
#                 "internalType": "string",
#                 "name": "",
#                 "type": "string"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [],
#         "name": "owner",
#         "outputs": [
#             {
#                 "internalType": "address",
#                 "name": "",
#                 "type": "address"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "ownerOf",
#         "outputs": [
#             {
#                 "internalType": "address",
#                 "name": "",
#                 "type": "address"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "bytes4",
#                 "name": "interfaceId",
#                 "type": "bytes4"
#             }
#         ],
#         "name": "supportsInterface",
#         "outputs": [
#             {
#                 "internalType": "bool",
#                 "name": "",
#                 "type": "bool"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [],
#         "name": "symbol",
#         "outputs": [
#             {
#                 "internalType": "string",
#                 "name": "",
#                 "type": "string"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     },
#     {
#         "inputs": [
#             {
#                 "internalType": "uint256",
#                 "name": "tokenId",
#                 "type": "uint256"
#             }
#         ],
#         "name": "tokenURI",
#         "outputs": [
#             {
#                 "internalType": "string",
#                 "name": "",
#                 "type": "string"
#             }
#         ],
#         "stateMutability": "view",
#         "type": "function"
#     }
# ]


# json_sent = {"message":"I confirm that I am the owner of the NFT with Token ID: [TokenID]","signature":"0x4699900e20e80152ea24065e890cbdf69ee8d169f94f82234760ffc2ac8dd98532015468cbdb5b61921fa8f7819ab20d70ae7b03da76fccc7d73ded20d025d4e1b","hash":"0x281baf6602001ade2eea8528409b85f0c89461c09a64971bc52bf4c5721cd5a7"}

# # Connect to Ethereum node
# w3 = Web3(Web3.HTTPProvider('https://polygon-mumbai-bor.publicnode.com'))

# # Create contract instance
# contract_address = "0x30B9a25E4b88CF8A258CE1910827e3B7957b4ce2"
# contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# # Get token ID from transaction hash
# tx_hash = json_sent["hash"]
# print(tx_hash)
# receipt = w3.eth.get_transaction_receipt(tx_hash)
# transaction = w3.eth.get_transaction(tx_hash)
# contract_address_from_tx = transaction.to
# data_from_input = transaction.input

# for log in receipt.logs:
#     if log.topics[0] == w3.keccak(text="Transfer(address,address,uint256)"):
#         token_id = int(log.topics[3].hex(), 16)
#         print(token_id)
#         break




# # Get token URI
# token_uri = contract.functions.tokenURI(token_id).call()

# json_uri = json.loads(token_uri)
# print(json_uri)



# message_from_user = json_sent["message"]
# signature_from_user = json_sent["signature"]
# hash_from_user = json_sent["hash"]

# print(message_from_user)
# print(signature_from_user)
# print(hash_from_user)
