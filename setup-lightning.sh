echo "Checking if Core Lightning is installed .... "
if ! command -v lightningd > /dev/null 2>&1 || ! command -v lightning-cli > /dev/null 2>&1; then
    echo "Core Lightning not found. Installing Core Lightning .... "
    mkdir -p install
    cd install
    wget https://github.com/ElementsProject/lightning/releases/download/v25.09.3/clightning-v25.09.3-Ubuntu-22.04-amd64.tar.xz > /dev/null 2>&1
    tar -xf clightning-v25.09.3-Ubuntu-22.04-amd64.tar.xz
    sudo cp -r usr/bin/* /usr/local/bin/
    sudo cp -r usr/libexec/* /usr/local/libexec/
    mkdir -p ~/.lightning
    cd ..
else
    echo "Core Lightning is already installed."
fi
LIGHTNING_CONF=~/.lightning/config

if [ ! -f "$LIGHTNING_CONF" ]; then
    echo "config not found. Creating Lightning config .... "
    touch "$LIGHTNING_CONF"
fi
CONFIG_LINES="network=regtest
log-level=debug
bitcoin-rpcuser=alice
bitcoin-rpcpassword=password
bitcoin-rpcport=18443
addr=127.0.0.1:9735"

if ! grep -Fxq "network=regtest" "$LIGHTNING_CONF"; then
    echo "$CONFIG_LINES" >> "$LIGHTNING_CONF"
    echo "Configuration added to Lightning config"
else
    echo "Configuration already exists in Lightning config"
fi

lightningd --daemon --log-file=$HOME/.lightning/lightning.log
sleep 5
