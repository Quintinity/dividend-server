import { expect } from 'chai';
import 'mocha'

import { getSource } from "../src/gatherer/sources/sources";
import { SourceNasdaq } from "../src/gatherer/sources/source_nasdaq";

describe("test sources", () => {
    it("get sources", () => {
        expect(getSource({symbol: "", source: "nasdaq"})).to.be.instanceof(SourceNasdaq);
    });

    it("get source nonexistent", () => {
        expect(() => getSource({symbol: "", source: "abc"})).to.throw();
    });

    it("nasdaq", async () => {
        let dividend = await new SourceNasdaq().findLatestDividend({symbol: "msft", source: "nasdaq"});
        expect(dividend.symbol).to.eq("msft");
        expect(dividend.amount).to.eq(0);
        expect(dividend.paymentDate).to.be.null;
        expect(dividend.recordDate).to.be.null;
    });
});