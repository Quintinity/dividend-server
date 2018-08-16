import moment from "moment";
import chai, { expect } from "chai";
import { getSource } from "../src/gatherer/sources/sources";
import { SourceNasdaq } from "../src/gatherer/sources/source_nasdaq";
import { SourceVanguardCanada } from "../src/gatherer/sources/source_vanguard_canada";
import { Constants } from "../src/constants";

describe("test sources", () => {
    it("get sources", () => {
        expect(getSource({ symbol: "", source: "nasdaq" })).to.be.instanceof(SourceNasdaq);
    });

    it("get source nonexistent", () => {
        expect(() => getSource({ symbol: "", source: "abc" })).to.throw();
    });

    it("nasdaq", async () => {
        const dividend = await new SourceNasdaq().findLatestDividend({ symbol: "msft", source: "nasdaq" });
        expect(dividend.symbol).to.eq("msft");
        expect(dividend.amount).to.be.greaterThan(0);
        expect(dividend.paymentDate.isAfter(moment("06-14-2018", Constants.DATE_FORMAT))).to.be.true;
        expect(dividend.exDate.isAfter(moment("05-16-2018", Constants.DATE_FORMAT))).to.be.true;;
    });

    it("vanguard canada", async () => {
        const dividend = await new SourceVanguardCanada().findLatestDividend({ symbol: "vfv", source: "vanguard_canada", identifier: "9563" });
        expect(dividend.symbol).to.equal("vfv");
        expect(dividend.amount).to.be.greaterThan(0);
        expect(dividend.paymentDate.isAfter(moment("07-09-2018", Constants.DATE_FORMAT))).to.be.true;
        expect(dividend.exDate.isAfter(moment("06-27-2018", Constants.DATE_FORMAT))).to.be.true;
    });
});