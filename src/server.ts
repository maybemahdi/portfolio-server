/* eslint-disable no-console */
import { Server } from "http";
import config from "./config";
import app from "./app";

let server: Server;

async function main() {
  server = app.listen(config.port, () => {
    console.log(`App is listening on port ${config.port}`);
  });
}

main();

process.on("unhandledRejection", () => {
  console.log("👿 Unhandled Rejection is detected, Shutting Down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("👿 Uncaught Rejection is detected, Shutting Down!");
  process.exit(1);
});
