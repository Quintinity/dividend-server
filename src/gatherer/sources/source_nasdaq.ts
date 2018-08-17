import { Source } from "./source";
import { Dividend, DividendQuery } from "../../dividend";
import axios from "axios";
import cheerio from "cheerio";
import { sprintf } from "sprintf-js";
import moment from "moment";
import { getRandomUserAgent } from "../useragents";

export class SourceNasdaq extends Source {
    getUrl(): string {
        return "https://m.nasdaq.com/symbol/%(symbol)s/dividend-history";
    }

    getCurrency() : string {
        return "USD";
    }

    async findLatestDividend(query: DividendQuery): Promise<Dividend> {
        const formattedUrl = sprintf(this.getUrl(), query);
        const data: string = (await axios.get(formattedUrl, {
            headers: {
                "User-Agent": getRandomUserAgent(),
                "Accept": "*/*"
            }
        })).data as string;

        const $ = cheerio.load(data);
        const row = $("#table-saw > tbody > tr").first();
        const exDate = moment(row.find("td").eq(0).text(), "YYYYMMDD").utc().startOf("day");
        const paymentDate = moment(row.find("td").eq(4).text(), "YYYYMMDD").utc().startOf("day");
        const amount = parseFloat(row.find("td").eq(1).text());

        return new Dividend(query.symbol, amount, exDate, paymentDate, this.getCurrency());
    }
};
