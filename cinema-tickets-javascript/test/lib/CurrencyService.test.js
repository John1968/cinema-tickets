import {expect, jest} from '@jest/globals';
import CurrencyService from '../../src/pairtest/lib/CurrencyService';
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import {ERROR_MAP} from "../../src/pairtest/lib/Config.js";



jest.mock('../../src/pairtest/lib/logger');

describe('CurrencyService', () => {
    it('should return a price in pound when passed an integer', () => {
        const currencyService = new CurrencyService();
        const result = currencyService.getPriceInPounds(10);
        expect(result).toEqual('£10.00');
    });

    it('should log an error when the parameter is not a number', () => {
        const currencyService = new CurrencyService();
        expect(() => currencyService.getPriceInPounds('not-a-number')).toThrow(new InvalidPurchaseException(ERROR_MAP.COST_NOT_AN_INTEGER));
    });
});
