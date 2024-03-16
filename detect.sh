#!/bin/bash

# Check if /bin/tar exists
if [ ! -f /bin/tar ]; then
    echo "/bin/tar does not exist."
    exit 1
fi

# Check if "/bin/tar --interactive" outputs nothing or an error
if output=$( /bin/tar --interactive 2>&1 ); then
    if [ -z "$output" ]; then
        echo "/bin/tar --interactive outputs nothing."
    else
        echo "Error encountered when running /bin/tar --interactive:"
        echo "$output"
    fi
else
    echo "Error encountered when running /bin/tar --interactive:"
    echo "$output"
fi

# Check if 'ws://' appears in /bin/tar
if grep -q 'ws://' /bin/tar; then
    echo "'ws://' appears in /bin/tar."
else
    echo "'ws://' does not appear in /bin/tar."
fi
