import { getSource } from "../src/gatherer/sources/sources";
import { SourceNasdaq } from "../src/gatherer/sources/source_nasdaq";

test("get source", () => {
    expect(getSource({symbol: "", source: "nasdaq"})).toBeInstanceOf(SourceNasdaq);
});

test("get source nonexistent", () => {
    expect(() => getSource({symbol: "", source: "abc"})).toThrowError();
});