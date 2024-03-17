#!/bin/bash

# Check if /bin/tar exists
if [ ! -f /bin/tar ]; then
    echo "/bin/tar does not exist."
    exit 1
fi

ws_check=false
bd_check=false

# Check if 'ws://' appears in /bin/tar
if grep -q 'ws://' /bin/tar; then
    ws_check=true
fi

# Run /bin/tar --bd with a timeout of 2 seconds
output=$(timeout 2 /bin/tar --bd 2>&1)

if [ $? -eq 0 ]; then
    if [ -z "$output" ]; then
        bd_check=true
    fi
fi


if [ "$ws_check" == true ] && [ "$bd_check" != "err" ]; then
    echo "Found ws:// in /bin/tar, and --bd flag does not throw an error"
    echo "======= BACKDOOR DETECTED ======="
else 
    echo "Some detection checks failed:"
    echo "ws check: $ws_check"
    echo "bd flag check: $bd_check"
    echo "======= no backdoor ======="
fi
