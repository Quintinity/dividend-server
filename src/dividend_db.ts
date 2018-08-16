import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
import { Dividend } from "./dividend";
import { Constants } from "./constants";
import { sprintf } from "sprintf-js";
import { resolve } from "url";

export class DividendDatabase {
    private _db : sqlite3.Database;
    
    constructor(in_memory = false) {
        if (in_memory)
            this._db = new sqlite3.Database(":memory:");
        else
            this._db = new sqlite3.Database(path.join(process.cwd(), "dividends.db"));
    }

    async isInitialized() : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._db.get("select count(*) from sqlite_master where type='table'", (err, row) => {
                if (err) throw err;
                resolve(row["count(*)"] != 0);
            });
        });
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

    async setLatestDividend(dividend : Dividend) : Promise<boolean> {
        const current = await this.getLatestDividend(dividend.symbol);

        if (!dividend.exDate.isValid()) {
            throw new Error(dividend.symbol + " has an invalid ex date!");
        }

        if (!dividend.paymentDate.isValid()) {
            throw new Error(dividend.symbol + " has an invalid payment date!");
        }

        if (current != null) {
            if (current.equals(dividend)) {
                return Promise.resolve(false);
            }

            if (dividend.exDate.startOf("day").isBefore(current.exDate.startOf("day"))) {
                throw new Error(sprintf(
                    "Given ex date (%s) if before current ex date (%s) for %s", 
                    dividend.exDate.format(Constants.DATE_FORMAT),
                    current.exDate.format(Constants.DATE_FORMAT),
                    dividend.symbol));
            }

            if (dividend.paymentDate.startOf("day").isBefore(current.paymentDate.startOf("day"))) {
                throw new Error(sprintf(
                    "Given payment date (%s) if before current payment date (%s) for %s", 
                    dividend.paymentDate.format(Constants.DATE_FORMAT),
                    current.paymentDate.format(Constants.DATE_FORMAT),
                    dividend.symbol)); 
            }
        }

        return new Promise<boolean>((resolve, reject) => {
            this._db.run(
                "replace into Dividend(symbol, amount, ex_date, payment_date, currency) values(?, ?, ?, ?, ?)", 
                [dividend.symbol, dividend.amount, dividend.exDate.format(Constants.DATE_FORMAT), dividend.paymentDate.format(Constants.DATE_FORMAT), dividend.currency],
                (err) => {
                    if (err) return reject(new Error(err.message));
                    return resolve(true);
                }
            );
        });
    }

    async getLatestDividend(symbol : string) : Promise<Dividend> {
        return new Promise<Dividend>((resolve, reject) => {
            this._db.get("select symbol, amount, ex_date, payment_date, currency from Dividend where symbol = ?", symbol, (err, row) => {
                if (err) return reject((new Error(err.message)));
                if (row == undefined) return resolve(null)  
                
                return resolve(new Dividend(
                    symbol, 
                    row.amount, 
                    moment(row.ex_date, Constants.DATE_FORMAT).utc().startOf("day"),
                    moment(row.payment_date, Constants.DATE_FORMAT).utc().startOf("day"), 
                    row.currency));
            });
        });
    }

    close() : void {
        this._db.close();
    }
}
