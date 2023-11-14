import {expect, jest} from '@jest/globals';
import CurrencyService from '../../src/pairtest/lib/CurrencyService';



jest.mock('../../src/pairtest/lib/logger');

describe('CurrencyService', () => {
    it('should return a price in pound when passed an integer', () => {
        const currencyService = new CurrencyService();
        const result = currencyService.getPriceInPounds(10);
        expect(result).toEqual('£10.00');
    });

    it('should return a price in pound when passed an floating point number', () => {
        const currencyService = new CurrencyService();
        const result = currencyService.getPriceInPounds(1.15);
        expect(result).toEqual('£1.15');
    });

    it('should log an error when the parameter is not a number', () => {
        const currencyService = new CurrencyService();
        const result = currencyService.getPriceInPounds('not-a-number');
        expect(result).toEqual('£NaN');
    });
});
