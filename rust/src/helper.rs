use serde_json::Value;
use std::process::Command;

/// Execute bitcoin-cli command via docker
/// Uses sh -c to properly handle shell quoting
pub fn bitcoin_cli(command: &str) -> Result<Value, Box<dyn std::error::Error>> {
    let full_command = format!(
        "docker exec bitcoind bitcoin-cli -regtest -rpcuser=alice -rpcpassword=password {}",
        command
    );

    let output = Command::new("sh")
        .arg("-c")
        .arg(&full_command)
        .output()?;

    if !output.status.success() {
        return Err(format!("bitcoin-cli command failed: {}", String::from_utf8_lossy(&output.stderr)).into());
    }

    let stdout = String::from_utf8(output.stdout)?.trim().to_string();

    // Try to parse as JSON, if it fails, return as string value
    match serde_json::from_str::<Value>(&stdout) {
        Ok(json) => Ok(json),
        Err(_) => Ok(Value::String(stdout)),
    }
}

/// Execute lightning-cli command via docker
/// Uses sh -c to properly handle shell quoting
pub fn ln_cli(command: &str) -> Result<Value, Box<dyn std::error::Error>> {
    let full_command = format!(
        "docker exec ln-node lightning-cli --network=regtest {}",
        command
    );

    let output = Command::new("sh")
        .arg("-c")
        .arg(&full_command)
        .output()?;

    if !output.status.success() {
        return Err(format!("lightning-cli command failed: {}", String::from_utf8_lossy(&output.stderr)).into());
    }

    let stdout = String::from_utf8(output.stdout)?.trim().to_string();
    Ok(serde_json::from_str(&stdout)?)
}
