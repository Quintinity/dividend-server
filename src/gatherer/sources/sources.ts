import { Source } from "./source";
import { SourceNasdaq } from "./source_nasdaq";
import { Dividend, DividendQuery } from "../../dividend"
import { SourceVanguardCanada } from "./source_vanguard_canada";

const sources = new Map<string, Source>();
sources.set("nasdaq", new SourceNasdaq());
sources.set("vanguard_canada", new SourceVanguardCanada());

function getSource(sourceID : string) : Source {
    let source : Source = sources.get(sourceID);
    if (source == undefined) {
        throw new Error(sourceID + " is not a valid source");
    }
    return source;
}


export { getSource };
