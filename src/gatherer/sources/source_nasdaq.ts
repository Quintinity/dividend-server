import { Source } from "./source";
import { Dividend, DividendQuery } from "../../dividend";

export class SourceNasdaq extends Source {
    getUrl(): string {
        return "https://m.nasdaq.com/symbol/${symbol}/dividend-history";
    }

    findLatestDividend(query: DividendQuery) : Dividend {
        return new Dividend(query.symbol, 0, null, null);
    }
};