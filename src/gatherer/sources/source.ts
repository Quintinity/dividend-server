import { Dividend, DividendQuery } from "../../dividend";

export abstract class Source {
    abstract getUrl(): string;
    abstract findLatestDividend(query: DividendQuery) : Dividend;
};
