import http from "node:http";
import { config } from "./config.js";
import { bootstrap } from "./bootstrap.js";

async function main() {
  const httpServer = http.createServer();

  await bootstrap(httpServer);

  httpServer.listen(config.port, () => {
    console.log(`WS server listening on http://localhost:${config.port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start ws-server:", error);
  process.exit(1);
});
