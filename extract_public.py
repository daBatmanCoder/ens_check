from eth_keys import keys
from eth_keys.datatypes import Signature


# Assuming you have the message, signature, and public key
message = "I confirm that I am the owner of the NFT with Token ID: [TokenID]"

# The signed message (in hexadecimal format)
signed_message_hex = "0x4699900e20e80152ea24065e890cbdf69ee8d169f94f82234760ffc2ac8dd98532015468cbdb5b61921fa8f7819ab20d70ae7b03da76fccc7d73ded20d025d4e1b"


# User's Ethereum address
user_address = "0xADaAf2160f7E8717FF67131E5AA00BfD73e377d5"

signed_message_bytes = bytes.fromhex(signed_message_hex[2:])

# Decode the signed message
signature = Signature(signed_message_bytes)

# Recover the public key from the signature
public_key = signature.recover_public_key()
# Get the Ethereum address from the public key
recovered_address = keys.PublicKey(public_key).to_checksum_address()
print(recovered_address)