"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dividend {
    constructor(symbol, amount, recordDate, paymentDate) {
        this._symbol = symbol;
        this._amount = amount;
        this._recordDate = recordDate;
        this._paymentDate = paymentDate;
    }
    get symbol() { return this._symbol; }
    get amount() { return this._amount; }
    get recordDate() { return this._recordDate; }
    get paymentDate() { return this._paymentDate; }
}
exports.Dividend = Dividend;
;
;
//# sourceMappingURL=dividend.js.map