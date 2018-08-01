import { Source } from "./source";
import { Dividend, DividendQuery } from "../../dividend";
import axios from "axios";
import { sprintf } from "sprintf-js";

export class SourceNasdaq extends Source {
    getUrl(): string {
        return "https://m.nasdaq.com/symbol/%(symbol)s/dividend-history";
    }
    
    async findLatestDividend(query: DividendQuery) : Promise<Dividend> {
        let formattedUrl = sprintf(this.getUrl(), query);        
        let data : string = (await axios.get(formattedUrl)).data as string;
        return new Dividend(query.symbol, 0, null, null);
    }
};