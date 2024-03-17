import { symmetricEncrypt, symmetricDecrypt, privkeyDecrypt } from "./crypto";

import { WebSocketServer } from "ws";

const port = SERVER_PORT;
const private_key = PRIVATE_KEY;
const wss = new WebSocketServer({ port });
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

let ws = await new Promise(resolve => {wss.on("connection", resolve)});
let symkey = null;

ws.on("error", console.error);

ws.on("message", function message(data) {
  // Check if symkey is configured. If not, load first message as encrypted symkey.
  if (symkey == null) {
    console.log("Connection established. Decoding symmetric key");
    symkey = privkeyDecrypt(data, private_key);
    console.log("Decoded", symkey);
    console.log("You may now enter commands");
    return;
  }

  // Otherwise, decode and display result
  const decryptedData = symmetricDecrypt(data, symkey);
  console.log(decryptedData.toString("utf8"));
});

ws.on("close", () => {
  console.log("Socket session closed");
  process.exit();
});

rl.on("line", (command) => {
  const encryptedCommand = symmetricEncrypt(command, symkey);
  ws.send(encryptedCommand);
});

rl.on("close", () => {
  ws.close();
});