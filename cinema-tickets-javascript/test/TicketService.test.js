// noinspection JSCheckFunctionSignatures

import { afterAll, beforeAll, expect, jest } from'@jest/globals';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import TicketService from '../src/pairtest/TicketService';
import CalculationService from '../src/pairtest/lib/CalculationService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import logger from '../src/pairtest/lib/logger'
import { ERROR_MAP } from '../src/pairtest/lib/Config';


jest.mock('../src/pairtest/lib/logger')
jest.mock('../src/pairtest/lib/CalculationService')

describe('#TicketService', () => {
    let ticketService;
    describe('building the ticket request object', () => {
        let fakeTicketTypeRequest;
        let getTotalTicketsByTypeMock
        beforeAll(() => {
            jest.clearAllMocks();
            ticketService = new TicketService();
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            getTotalTicketsByTypeMock = jest
                .spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            const accountId = 12345
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 1);
            const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 1);
            fakeTicketTypeRequest = [fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest]
            ticketService.purchaseTickets(accountId, fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest);
        });
        afterAll(() => {
            jest.resetAllMocks()
        })
        it('should call getTotalTicketsByType to get a ticket request object', () => {
            expect(getTotalTicketsByTypeMock).toHaveBeenCalledWith(fakeTicketTypeRequest)
        });
        it('log the booking details before calling the validation service', () => {
           expect(logger.info).toHaveBeenCalledWith('About to validate ticket request for Account: 12345. Booking comprises 1 adult(s), 0 child(ren) and 0 infant(s)')
        });
    });
    describe('accountIdValidation', () => {
        beforeEach(() => {
            ticketService = new TicketService();
        });
        describe('accountId is a valid number', () => {
            it('should not throw an error if the account ID is a number greater than 0', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const accountId = 1;
                const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
                const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 1);
                const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 1);
                const fakeTicketTypeRequest = [fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest]
                expect(() => ticketService.purchaseTickets(accountId, fakeTicketTypeRequest)).not.toThrow()
            })
        });
        describe('accountId is NOT a valid number', () => {
            it('should throw an InvalidPurchaseException when the accountId < 1', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const accountId = 0;
                const ticketService = new TicketService()
                expect(() => ticketService.purchaseTickets(accountId)).toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_LESS_THAN_ONE))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.ACCOUNT_ID_LESS_THAN_ONE);
            });
            it('should throw an InvalidPurchaseException when the accountId is not a number', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const accountId = 'not-a-number';
                const ticketService = new TicketService()
                expect(() => ticketService.purchaseTickets(accountId)).toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER);
            });
            it('should throw an InvalidPurchaseException when the accountId is not provided', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const ticketService = new TicketService()
                expect(() => ticketService.purchaseTickets(null)).toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_NOT_PROVIDED))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.ACCOUNT_ID_NOT_PROVIDED);
            });
        });
    });
});
