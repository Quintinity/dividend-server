import { Source } from "./source";
import { Dividend, DividendQuery } from "../../dividend";
import { sprintf } from "sprintf-js";
import moment from "moment";
import axios from "axios";

export class SourceVanguardCanada extends Source {
    getUrl(): string {
        return "https://api.vanguard.com/rs/gre/gra/1.5.0/datasets/caw-indv-price-distribution.jsonp?vars=portId:%(identifier)s,issueType:F&callback=_";
    }

    getCurrency() : string {
        return "CAD";
    }

    async findLatestDividend(query: DividendQuery): Promise<Dividend> {
        const formattedUrl = sprintf(this.getUrl(), query);
        const data: string = (await axios.get(formattedUrl)).data as string;
        const json: any = JSON.parse(data.substring(2, data.length - 1));

        const row = json["distributions"]["fundDistributionList"][0];
        const amount = row["distributionAmount"] as number;
        const exDate = moment(row["exDividendDate"]).utc().startOf("day");
        const paymentDate = moment(row["payableDate"]).utc().startOf("day");

        return new Dividend(query.symbol, amount, exDate, paymentDate, this.getCurrency());
    }
};
