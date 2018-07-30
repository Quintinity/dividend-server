"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_nasdaq_1 = require("./source_nasdaq");
const sources = new Map();
sources.set("nasdaq", new source_nasdaq_1.SourceNasdaq());
function getSource(query) {
    let source = sources.get(query.source);
    if (source == undefined) {
        throw new Error(query.source + " is not a valid source");
    }
    return source;
}
exports.getSource = getSource;
//# sourceMappingURL=sources.js.map