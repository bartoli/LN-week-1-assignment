import subprocess
import json

def bitcoin_cli(command):
    """Execute bitcoin-cli command via docker"""
    cmd = f'docker exec bitcoind bitcoin-cli -regtest -rpcuser=alice -rpcpassword=password {command}'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
    output = result.stdout.strip()
    try:
        return json.loads(output)
    except json.JSONDecodeError:
        return output

def ln_cli(command):
    """Execute lightning-cli command via docker"""
    cmd = f'docker exec ln-node lightning-cli --network=regtest {command}'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
    return json.loads(result.stdout.strip())
