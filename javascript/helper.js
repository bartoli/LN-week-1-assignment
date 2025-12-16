const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Helper function to execute bitcoin-cli commands via docker
async function bitcoinCli(command) {
    const { stdout, stderr } = await execPromise(`docker exec bitcoind bitcoin-cli -regtest -rpcuser=alice -rpcpassword=password ${command}`);
    if (stderr && !stderr.includes('WARNING')) {
        console.error('Bitcoin CLI stderr:', stderr);
    }
    const output = stdout.trim();
    // Try to parse as JSON, if it fails, return the raw string
    try {
        return JSON.parse(output);
    } catch (e) {
        return output;
    }
}

// Helper function to execute lightning-cli commands via docker
async function lightningCli(command) {
    const { stdout, stderr } = await execPromise(`docker exec ln-node lightning-cli --network=regtest ${command}`);
    if (stderr && !stderr.includes('WARNING')) {
        console.error('Lightning CLI stderr:', stderr);
    }
    return JSON.parse(stdout);
}

module.exports = {
    bitcoinCli,
    lightningCli
};
