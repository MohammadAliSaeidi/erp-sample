import { httpServer } from "./http.js";
import { config } from "./config.js";
import { bootstrap } from "./bootstrap.js";
import "./socket.js";

httpServer.listen(config.port, async () => {
  console.log(`[ws] server listening on port ${config.port}`);
  console.log(`[ws] health check: http://localhost:${config.port}/health`);
  await bootstrap();
});
