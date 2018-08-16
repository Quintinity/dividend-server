import { Moment } from "moment";

class Dividend {
    private _symbol: string;
    private _amount: number;
    private _exDate: Moment;
    private _paymentDate: Moment;
    private _currency : string;

    constructor(symbol: string, amount: number, exDate: Moment, paymentDate: Moment, currency : string) {
        this._symbol = symbol;
        this._amount = amount;
        this._exDate = exDate;
        this._paymentDate = paymentDate;
        this._currency = currency;
    }

    get symbol(): string { return this._symbol; }
    get amount(): number { return this._amount; }
    get exDate(): Moment { return this._exDate; }
    get paymentDate(): Moment { return this._paymentDate; }
    get currency() : string { return this._currency };
};

interface DividendQuery {
    readonly symbol: string;
    readonly source: string;
    readonly identifier?: string;
};

export { Dividend, DividendQuery };