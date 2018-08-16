import sqlite3 from "sqlite3";
import path from "path";
import { Dividend } from "./dividend";

export class DividendDatabase {
    private _db : sqlite3.Database;
    
    constructor(in_memory = false) {
        if (in_memory)
            this._db = new sqlite3.Database(":memory:");
        else
            this._db = new sqlite3.Database(path.join(process.cwd(), "dividends.db"));
    }

    async isInitialized() : boolean {
        this._db.get("select count(*) from sqlite_master where type='table'", (err, row) => {
            return true;
        });
    }

    runSqlScript(script : string) : void {

    }

    setLatestDividend(dividend : Dividend) : void {
        
    }

    getLatestDividend(symbol : string) : Dividend {
        return null;
    }

    close() : void {
        this._db.close();
    }
}
