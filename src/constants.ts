import path from "path";

export namespace Constants {
    export const DATE_FORMAT : string = "MM-DD-YYYY";
    export const DEFAULT_DIVIDEND_DB_PATH = path.join(process.cwd(), "dividends.db");
};
