import express from "express";
import schedule from "node-schedule";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { getnextdividend_router } from "./app/getnextdividend";
import { DividendDatabase } from "./dividend_db";

const app = express();
const port = parseInt(process.env.PORT) || 8080;
const db = new DividendDatabase();

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
app.listen(port, async () => {
    console.log("Started dividend server on port " + port);

    // Initialize the database if required
    if (!(await db.isInitialized())) {
        await db.runSqlScript(fs.readFileSync(path.join(process.cwd(), "schema.sql")).toString());
        console.log("Dividends database initialized!");
    }

    runDividendGatherer();
    // schedule.scheduleJob({ hour: parseInt(process.env.HOUR) || 0, minute: 0 }, runDividendGatherer);
});
