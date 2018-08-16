/*
    TODO: disable package-lock.json
*/
import express from "express";
import { spawn } from "child_process";
import schedule from "node-schedule";
import path from "path";
import { getnextdividend_router } from "./app/getnextdividend";

const app: express.Express = express();
const port: number = parseInt(process.env.PORT) || 8080;

function runDividendGatherer(): void {
    const gatherer = spawn("node", [path.join(process.cwd(), "dist/src/gatherer/gatherer.js")]);

    gatherer.stdout.on("data", (data) => {
        process.stdout.write(data);
    });

    gatherer.stderr.on('data', (data) => {
        process.stderr.write(data);
    });
      
    gatherer.on("close", (exitCode) => {
        console.log("Gatherer finished with exit code " + exitCode);
    });
}

app.use(getnextdividend_router);
app.listen(port, () => {
    console.log("Started dividend server on port " + port);
    runDividendGatherer();
    // schedule.scheduleJob({ hour: parseInt(process.env.HOUR) || 0, minute: 0 }, runDividendGatherer);
});
