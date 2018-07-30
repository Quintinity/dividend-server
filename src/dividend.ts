class Dividend {
    private _symbol: string;
    private _amount: number;
    private _recordDate: Date;
    private _paymentDate: Date;

    constructor(symbol: string, amount: number, recordDate: Date, paymentDate: Date) {
        this._symbol = symbol;
        this._amount = amount;
        this._recordDate = recordDate;
        this._paymentDate = paymentDate;
    }

    get symbol(): string { return this._symbol; }
    get amount(): number { return this._amount; }
    get recordDate(): Date { return this._recordDate; }
    get paymentDate(): Date { return this._paymentDate; }
};

interface DividendQuery {
    readonly symbol: string;
    readonly source: string;
    readonly identifier?: number;
};

export { Dividend, DividendQuery };