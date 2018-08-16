import moment from "moment";
import { DividendDatabase } from "../src/dividend_db"
;
import chai, { expect } from "chai";
const DATE_FORMAT = "MM-DD-YYYY";

describe("test database", () => {
    it("create", () => {
        const db = new DividendDatabase(false);
    });
});