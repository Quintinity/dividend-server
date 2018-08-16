import fs from "fs";
import path from "path";

const stocksJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "stocks.json"), "UTF-8"));
for (var sourceName in stocksJson) {
    console.log(sourceName);
}
