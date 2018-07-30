"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
const dividend_1 = require("../../dividend");
class SourceNasdaq extends source_1.Source {
    getUrl() {
        return "https://m.nasdaq.com/symbol/${symbol}/dividend-history";
    }
    findLatestDividend(query) {
        return new dividend_1.Dividend("", 0, null, null);
    }
}
exports.SourceNasdaq = SourceNasdaq;
;
//# sourceMappingURL=source_nasdaq.js.map