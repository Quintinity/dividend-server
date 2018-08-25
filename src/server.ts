import express from "express";
import schedule from "node-schedule";
import fs from "fs";
import path from "path";
import moment from "moment";
import { spawn } from "child_process";
import { DividendDatabase } from "./dividend_db";
import { Constants } from "./constants"

const app = express();
const port = parseInt(process.env.PORT) || 8080;
const db = new DividendDatabase(process.env.DIVIDEND_DB_PATH || Constants.DEFAULT_DIVIDEND_DB_PATH);

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

app.get("/getlatestdividend/:symbol", async (req, res) => {
    const symbol = req.params.symbol;

    try {
        const today = moment().utc().startOf('day');
        let dividend = await db.getLatestDividend(symbol.toUpperCase());
        if (dividend == null) {
            res.status(404).send({ error: "Symbol not supported" });
            return;
        }
        res.status(200).send(dividend.toJson());
    }
    catch (err) {
        res.status(500).send({ error: "An error occurred" });
    }
});

app.listen(port, async () => {
    console.log("Started dividend server on port " + port);

    // Initialize the database if required
    if (!(await db.isInitialized())) {
        await db.runSqlScript(fs.readFileSync(path.join(process.cwd(), "schema.sql")).toString());
        console.log("Dividends database initialized!");
    }

    schedule.scheduleJob({ hour: parseInt(process.env.HOUR) || 0, minute: 0 }, runDividendGatherer);
});
