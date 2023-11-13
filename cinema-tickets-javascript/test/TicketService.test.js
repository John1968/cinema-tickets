// noinspection JSCheckFunctionSignatures

import { beforeAll, expect, jest } from'@jest/globals';
import TicketService from '../src/pairtest/TicketService';
import CalculationService from '../src/pairtest/lib/CalculationService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

jest.mock('../src/pairtest/lib/logger')
jest.mock('../src/pairtest/lib/CalculationService')

describe('#TicketService', () => {
    let ticketService;
    describe('building the ticket request object', () => {
        beforeAll(() => {
            ticketService = new TicketService();
        });
        it('should call getTotalTicketsByType to get a ticket request object', () => {
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            const getTotalTicketsByTypeMock = jest
                .spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            const accountId = 12345
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 1);
            const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 1);
            const fakeTicketTypeRequest = [fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest]
            ticketService.purchaseTickets(accountId, fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest);
            expect(getTotalTicketsByTypeMock).toHaveBeenCalledWith(fakeTicketTypeRequest)
        })
    })
})
