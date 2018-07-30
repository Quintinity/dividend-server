import { SourceNasdaq } from "../src/gatherer/sources/source_nasdaq"

test("test source nasdaq", () => {
    let dividend = new SourceNasdaq().findLatestDividend({symbol: "msft", source: "nasdaq"});
    expect(dividend.symbol).toEqual("msft");
    expect(dividend.amount).toEqual(0);
    expect(dividend.paymentDate).toBeNull();
    expect(dividend.recordDate).toBeNull();
});