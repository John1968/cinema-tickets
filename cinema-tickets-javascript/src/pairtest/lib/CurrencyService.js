import { CURRENCY_FORMAT, ERROR_MAP } from './Config';

export default class CurrencyService {

    getCurrency() {
        return new Intl.NumberFormat(CURRENCY_FORMAT.GB.locale, {
            style: 'currency',
            currency: CURRENCY_FORMAT.GB.currency,
        });
    };

    getPriceInPounds(costOfBooking) {
        if (Number.isNaN(costOfBooking)) {
            throw new Error(ERROR_MAP.COST_NOT_AN_INTEGER);
        }
        const currency = this.getCurrency();
        return currency.format(costOfBooking);
    };
};
