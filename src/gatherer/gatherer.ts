import fs from "fs";
import path from "path";
import { getSource } from "./sources/sources";
import { Dividend, DividendQuery } from "../dividend";
import { DividendDatabase } from "../dividend_db";

(async () => {
    console.log("Running dividend gatherer process!");
    const stocksJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "stocks.json"), "UTF-8"));
    const db = new DividendDatabase();
    for (const sourceName in stocksJson) {
        let numNewDividends = 0;
        const source = getSource(sourceName);
        for (const index in stocksJson[sourceName]) {
            const obj = stocksJson[sourceName][index];
            const query : DividendQuery = {symbol: obj.symbol, source: sourceName, identifier: obj.identifier};

            try {
                const dividend = await source.findLatestDividend(query);
                const updated = await db.setLatestDividend(dividend);
                if (updated) {
                    console.log("New dividend found for " + query.symbol);
                    numNewDividends++;
                }
            
            }
            catch  (err) {
                console.error("Failed when processing dividend for " + query.symbol + ": " + err.message);
            }

        }
        console.log("Found " + numNewDividends + " new dividends for source " + sourceName);
    }
})();