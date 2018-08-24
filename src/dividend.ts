import { Moment } from "moment";
import { Constants } from "./constants";

class Dividend {
    private _symbol: string;
    private _amount: number;
    private _exDate: Moment;
    private _paymentDate: Moment;
    private _currency : string;
    private _lastUpdateDate : Moment;

    constructor(symbol: string, amount: number, exDate: Moment, paymentDate: Moment, currency : string, lastUpdateDate : Moment) {
        this._symbol = symbol;
        this._amount = amount;
        this._exDate = exDate;
        this._paymentDate = paymentDate;
        this._currency = currency;
        this._lastUpdateDate = lastUpdateDate;
    }

    get symbol(): string { return this._symbol; }
    get amount(): number { return this._amount; }
    get exDate(): Moment { return this._exDate; }
    get paymentDate(): Moment { return this._paymentDate; }
    get currency() : string { return this._currency };
    get lastUpdateDate() : Moment { return this._lastUpdateDate };

    equals(other : Dividend) : boolean {
        return this.symbol == other.symbol
            && this.amount == other.amount
            && this.exDate.isSame(other.exDate) 
            && this.paymentDate.isSame(other.paymentDate) 
            && this.currency == other.currency;
    }

    toJson() : object {
        return {
            symbol: this._symbol,
            amount: this._amount,
            exDate: this._exDate.format(Constants.DATE_FORMAT),
            paymentDate: this._paymentDate.format(Constants.DATE_FORMAT),
            currency: this._currency
        };
    }
};

interface DividendQuery {
    readonly symbol: string;
    readonly source: string;
    readonly identifier?: string;
};

export { Dividend, DividendQuery };