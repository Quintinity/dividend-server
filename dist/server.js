"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
    TODO: disable package-lock.json
*/
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const getnextdividend_1 = require("./app/getnextdividend");
const app = express_1.default();
const port = parseInt(process.env.PORT) || 8080;
function runDividendGatherer() {
    const gatherer = child_process_1.spawn("node", ["dist/gatherer.js"]);
    gatherer.stdout.on("data", (data) => {
        console.log("stdout: " + data);
    });
    gatherer.on("close", (exitCode) => {
        console.log("Gatherer finished with exit code " + exitCode);
    });
}
app.use(getnextdividend_1.getnextdividend_router);
app.listen(port, () => {
    console.log("Started dividend server on port " + port);
    runDividendGatherer();
    // schedule.scheduleJob({ hour: parseInt(process.env.HOUR) || 0, minute: 0 }, runDividendGatherer);
});
//# sourceMappingURL=server.js.map