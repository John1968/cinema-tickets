import { expect } from'@jest/globals';
import CalculationService from '../../src/pairtest/lib/CalculationService';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest';

describe('#CalculationService', () => {
    let calculationService = new CalculationService();
    describe('#getTotalTicketsByType', () => {
        const childTicketRequest = new TicketTypeRequest('CHILD', 0);
        const infantTicketRequest = new TicketTypeRequest('INFANT', 1);
        const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
        const validRequest = [childTicketRequest, infantTicketRequest, adultTicketRequest];
        const result = calculationService.getTotalTicketsByType(validRequest);
        it('should return a valid ticket request object', () => {
            expect(result).toEqual({"ADULT": 2, "CHILD": 0, "INFANT": 1});
        });
    });
});
