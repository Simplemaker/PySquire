# PySquire Command and Control Suite
By Thomas Williams

## Purpose
This project aims to provide a command and control client for educational
purposes satisfying the following goals:
1. Provide remote code execution
2. Persistence across reboots
3. Easy configuration
4. Authenticate communication
5. Hide the vulnerability

## Plan
This codebase will consist of 3 main parts:
1. An installer script which allows for easy configuration of the 
target machine client
2. An agent which runs on the target machine to accept and execute commands
3. An attacker server which sends commands to clients

## Node
For simplicity in web communication, this project will be NodeJS based.
Webpack will be used to transpile the client into a single file which
can be easily installed.

## Configuration
Configuration is done in the `config.json` file. This file can be prepared 
by copying `demo-config.json` to `config.json`, and then populating 
the proper server fields.

Additionally, an RSA keypair `private_key.pem` and `public_key.pem` must
be in the root directory.
