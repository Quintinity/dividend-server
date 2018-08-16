import { Dividend, DividendQuery } from "../../dividend";

export abstract class Source {
    abstract getUrl(): string;
    abstract getCurrency() : string;
    abstract async findLatestDividend(query: DividendQuery) : Promise<Dividend>;
};
