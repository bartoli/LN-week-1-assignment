const Client = require('bitcoin-core');
const LightningClient = require('clightning-client');
const os = require('os');
const path = require('path');
const fs = require('fs');

const client = new Client({
    network: 'regtest',
    username: 'alice',
    password: 'password',
    host: '127.0.0.1', // Host should not include the protocol
    port: 18443 // Ensure the correct port for regtest is used
});
const lightningclient = LightningClient(path.join(os.homedir(), '.lightning', 'regtest', 'lightning-rpc'));

async function main() {
    // Example: Get blockchain info and lightning node info
    const blockchainInfo = await client.getBlockchainInfo();
    console.log('Blockchain Info:', blockchainInfo);
    const nodeInfo = await lightningclient.getinfo();
    console.log('Node Info:', nodeInfo);

    // Create a new address for funding using lightning-cli and store it in CLN_ADDRESS

    // Create a bitcoin wallet named 'mining_wallet' using bitcoin-cli for mining

    // Generate a new address and mine blocks to it. How many blocks need to mined? Why?

    // Fund the Lightning node by sending 0.1 BTC from the mining wallet to CLN_ADDRESS

    // Confirm the funding transaction by mining 6 blocks

    // Verify Lightning wallet balance using lightning-cli listfunds

    // Create an invoice with parameters and store the invoice string:
    // - Amount: 50,000 satoshis (50000000 millisatoshis)
    // - Label: Generate unique label using timestamp (e.g., "invoice_$(date +%s)")
    // - Description: "Coffee Payment"
    // - Expiry: 3600 seconds

    // Decode the invoice string using lightning-cli decodepay and verify the parameters

    // Output the invoice details in the specified format to out.txt
    // - Payment hash
    // - BOLT11 invoice string
    // - Amount in satoshis
    // - Description
    // - Expiry time
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});