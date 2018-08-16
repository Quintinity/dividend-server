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
    const currentDate = moment().startOf("day");
    const origDividend = new Dividend("msft", 1, currentDate, currentDate, "USD");

    it("create", async () => {  
        expect(await db.isInitialized()).to.be.false;
        await db.runSqlScript(fs.readFileSync(path.join(process.cwd(), "schema.sql")).toString());
        expect(await db.isInitialized()).to.be.true;
    });

    it("insert and select", async () => {
        expect(await db.getLatestDividend(origDividend.symbol)).to.be.null;
        await db.setLatestDividend(origDividend);
        expect(origDividend.equals(await db.getLatestDividend(origDividend.symbol))).to.be.true;
    });

    it("insert old dividend", async () => {
        const newDividend = new Dividend("msft", 2, currentDate.subtract(1, "day"), currentDate.subtract(2, "day"), "USD");
       try {
           await db.setLatestDividend(newDividend);
       }
       catch (err) {
           return;
       }

       fail("setLatestDividend was expected to throw");
    });

    it("replace existing dividend", async () => {
        const newDividend = new Dividend("msft", 2, currentDate.add(1, "day"), currentDate.add(2, "day"), "USD");
        await db.setLatestDividend(newDividend);
        expect(newDividend.equals(await db.getLatestDividend(newDividend.symbol))).to.be.true;
    });
});
 