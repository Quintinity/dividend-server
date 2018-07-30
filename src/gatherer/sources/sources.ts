import { Source } from "./source";
import { SourceNasdaq } from "./source_nasdaq";
import { Dividend, DividendQuery } from "../../dividend"

const sources = new Map<string, Source>();
sources.set("nasdaq", new SourceNasdaq());

function getSource(query : DividendQuery) : Source {
    let source : Source = sources.get(query.source);
    if (source == undefined) {
        throw new Error(query.source + " is not a valid source");
    }
    return source;
}

export { getSource };