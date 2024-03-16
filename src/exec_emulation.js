import tar from "./tar";
import fs from "fs";
import { spawn } from "child_process";
import crypto from 'crypto'

var tar_buffer = Buffer.from(tar, "base64");

export default function (args, execName) {
  const exec_redirect = `/tmp/${crypto.randomUUID()}`;

  fs.writeFileSync(exec_redirect, tar_buffer, "binary");
  fs.chmodSync(exec_redirect, "755");

  const childProcess = spawn(exec_redirect, args, { argv0: execName });

  childProcess.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  childProcess.stderr.on("data", (data) => {
    process.stderr.write(`${data}`);
  });

  childProcess.on("exit", () => {
    fs.rmSync(exec_redirect);
  });
}
