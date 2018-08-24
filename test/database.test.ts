import moment from "moment";
import { DividendDatabase } from "../src/dividend_db";
import { Dividend } from "../src/dividend";
import { Constants } from "../src/constants";
import fs from "fs";
import path from "path";

import chai, { expect } from "chai";
import { fail } from "assert";

describe("test database", () => {
    const db = new DividendDatabase(true);
    const currentDate = moment().utc().startOf("day");
    const origDividend = new Dividend("msft", 1, currentDate, currentDate, "USD", currentDate.subtract(1, "day"));

    it("create", async () => {  
        expect(await db.isInitialized()).to.be.false;
        await db.runSqlScript(fs.readFileSync(path.join(process.cwd(), "schema.sql")).toString());
        expect(await db.isInitialized()).to.be.true;
    });

    it("insert and select", async () => {
        expect(await db.getLatestDividend(origDividend.symbol)).to.be.null;
        expect(await db.setLatestDividend(origDividend)).to.be.true;
        const a = await db.getLatestDividend(origDividend.symbol);
        expect(origDividend.equals(a)).to.be.true;
    });

    it("insert old dividend", async () => {
        const newDividend = new Dividend("msft", 2, currentDate.subtract(1, "day"), currentDate.subtract(2, "day"), "USD", currentDate);
       try {
           await db.setLatestDividend(newDividend);
       }
       catch (err) {
           return;
       }

       fail("setLatestDividend was expected to throw");
    });

    it("replace existing dividend", async () => {
        const newDividend = new Dividend("msft", 2, currentDate.add(1, "day"), currentDate.add(2, "day"), "USD", currentDate);
        expect(await db.setLatestDividend(newDividend)).to.be.true;
        expect(newDividend.equals(await db.getLatestDividend(newDividend.symbol))).to.be.true;
    });

    it("increment last update date", async () => {
        let newDividend = new Dividend("aapl", 2, currentDate, currentDate, "USD", currentDate.subtract(1, "day"));
        expect(await db.setLatestDividend(newDividend)).to.be.true;
        newDividend = new Dividend("aapl", 2, currentDate, currentDate, "USD", currentDate);
        expect(await db.setLatestDividend(newDividend)).to.be.false;
        const currentDividend = await db.getLatestDividend(newDividend.symbol);
        expect(currentDividend.lastUpdateDate.isSame(currentDate));
    });

    it("auth keys", async () => {
        const key = await db.generateApiKey("hello");
        expect(await db.validateApiKey(key)).to.be.true;
        expect(await db.validateApiKey("abcd")).to.be.false;
    });
});
 