import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
import { Dividend } from "./dividend";
import { Constants } from "./constants";
import { sprintf } from "sprintf-js";

export class DividendDatabase {
    private _db : sqlite3.Database;
    
    constructor(in_memory = false) {
        if (in_memory)
            this._db = new sqlite3.Database(":memory:");
        else
            this._db = new sqlite3.Database(path.join(process.cwd(), "dividends.db"));
    }

    async isInitialized() : Promise<boolean> {
        let promise = new Promise<boolean>((resolve, reject) => {
            this._db.get("select count(*) from sqlite_master where type='table'", (err, row) => {
                if (err) throw err;
                resolve(row["count(*)"] != 0);
            });
        });

        return promise;
    }

    async runSqlScript(script : string) : Promise<void> {
        const commands = script.split(";");
        return new Promise<void>(async (resolve, reject) => {
            for (const index in commands) {
                let p = new Promise<void>((resolve, reject) => {
                    const command = commands[index].trim();
                    if (command.length != 0)
                        this._db.run(commands[index], (err) => {
                            if (err) throw err;
                            resolve()
                        });
                    else
                        resolve();
                });
                await p;
            }
            resolve();
        });
    }

    async setLatestDividend(dividend : Dividend) : Promise<void> {
        const current = await this.getLatestDividend(dividend.symbol);
        if (current != null) {
            if (dividend.exDate.isBefore(current.exDate)) {
                throw new Error(sprintf(
                    "Given ex date (%s) if before current ex date (%s) for %s", 
                    dividend.exDate.format(Constants.DATE_FORMAT),
                    current.paymentDate.format(Constants.DATE_FORMAT),
                    dividend.symbol));
            }
            if (dividend.paymentDate.isBefore(current.paymentDate)) {
                throw new Error(sprintf(
                    "Given payment date (%s) if before current payment date (%s) for %s", 
                    dividend.exDate.format(Constants.DATE_FORMAT),
                    current.paymentDate.format(Constants.DATE_FORMAT),
                    dividend.symbol)); 
            }
        }

        return new Promise<void>((resolve, reject) => {
            this._db.run(
                "replace into Dividend(symbol, amount, ex_date, payment_date, currency) values(?, ?, ?, ?, ?)", 
                [dividend.symbol, dividend.amount, dividend.exDate.format(Constants.DATE_FORMAT), dividend.paymentDate.format(Constants.DATE_FORMAT), dividend.currency],
                (err) => {
                    if (err) throw err;
                    resolve();
                }
            );
        });
    }

    async getLatestDividend(symbol : string) : Promise<Dividend> {
        return new Promise<Dividend>((resolve, reject) => {
            this._db.get("select symbol, amount, ex_date, payment_date, currency from Dividend where symbol = ?", symbol, (err, row) => {
                if (err) throw err;
                if (row == undefined) {
                    resolve(null)
                    return;   
                };
                resolve(new Dividend(symbol, row.amount, moment(row.ex_date, Constants.DATE_FORMAT), moment(row.payment_date, Constants.DATE_FORMAT), row.currency));
            });
        });
    }

    close() : void {
        this._db.close();
    }
}
