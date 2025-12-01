from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from pyln.client import LightningRpc 
import os

def main():

    try:
        # Connect to Bitcoin Core RPC with basic credentials
        rpc_user = "alice"
        rpc_password = "password"
        rpc_host = "127.0.0.1"
        rpc_port = 18443
        base_rpc_url = f"http://{rpc_user}:{rpc_password}@{rpc_host}:{rpc_port}"

        # General client for non-wallet-specific commands
        client = AuthServiceProxy(base_rpc_url)

        # Get blockchain info
        blockchain_info = client.getblockchaininfo()
        print("Blockchain Info:", blockchain_info)

        rpc_path = os.path.join(os.path.expanduser("~"), ".lightning", "regtest", "lightning-rpc")
        ln_client = LightningRpc(rpc_path)
        ln_info = ln_client.getinfo()
        print("Lightning Info:", ln_info)

        # Create a new address for funding using lightning-cli and store it in CLN_ADDRESS

        # Create a bitcoin wallet named 'mining_wallet' using bitcoin-cli for mining

        # Generate a new address and mine blocks to it. How many blocks need to mined? Why?

        # Fund the Lightning node by sending 0.1 BTC from the mining wallet to CLN_ADDRESS

        # Confirm the funding transaction by mining 6 blocks

        # Verify Lightning wallet balance using lightning-cli listfunds

        # Create an invoice with parameters and store the invoice string:
        # - Amount: 50,000 satoshis (50000000 millisatoshis)
        # - Label: Generate unique label using timestamp (e.g., "invoice_$(date +%s)")
        # - Description: "Test Invoice"
        # - Expiry: 3600 seconds

        # Decode the invoice string using lightning-cli decodepay and verify the parameters

        # Output the invoice details in the specified format to out.txt
        # - Payment hash
        # - BOLT11 invoice string
        # - Amount
        # - Description
        # - Expiry time
    except JSONRPCException as e:
        print("An error occurred", e)

if __name__ == "__main__":
    main()
