use bitcoin::hex::DisplayHex;
use bitcoincore_rpc::bitcoin::Amount;
use bitcoincore_rpc::{Auth, Client, RpcApi};
use serde::Deserialize;
use serde_json::json;
use std::{env, io::Write};
use cln_rpc::{ClnRpc, model::requests::GetinfoRequest};

// Node access params
const RPC_URL: &str = "http://127.0.0.1:18443"; // Default regtest RPC port
const RPC_USER: &str = "alice";
const RPC_PASS: &str = "password";

// You can use calls not provided in RPC lib API using the generic `call` function.
// An example of using the `send` RPC call, which doesn't have exposed API.
// You can also use serde_json `Deserialize` derivation to capture the returned json result.
fn send(rpc: &Client, addr: &str) -> bitcoincore_rpc::Result<String> {
    let args = [
        json!([{addr : 100 }]), // recipient address
        json!(null),            // conf target
        json!(null),            // estimate mode
        json!(null),            // fee rate in sats/vb
        json!(null),            // Empty option object
    ];

    #[derive(Deserialize)]
    struct SendResult {
        complete: bool,
        txid: String,
    }
    let send_result = rpc.call::<SendResult>("send", &args)?;
    assert!(send_result.complete);
    Ok(send_result.txid)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Connect to Bitcoin Core RPC
    let rpc = Client::new(
        RPC_URL,
        Auth::UserPass(RPC_USER.to_owned(), RPC_PASS.to_owned()),
    )?;

    // Get blockchain info
    let blockchain_info = rpc.get_blockchain_info()?;
    dbg!(&blockchain_info);
    let sock = env::home_dir().unwrap().join(".lightning/regtest/lightning-rpc");
    let mut client = ClnRpc::new(&sock).await?;

    let request = GetinfoRequest {};
    let getinfo_result = client.call_typed(&request).await?;
    dbg!(&getinfo_result);

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

    Ok(())
}
