import { expect } from'@jest/globals';
import RequestValidationService from '../../src/pairtest/lib/RequestValidationService';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';
import { ERROR_MAP } from '../../src/pairtest/lib/Config';

describe('#RequestValidationService', () => {
    let requestValidationService = new RequestValidationService();
    describe('when all parameters are valid', () => {
        describe('when the account ID is valid', () => {
            it('does not throw an error', () => {
                expect(() => requestValidationService.requestIdValidator(54321))
                    .not.toThrow();
            });
        });
        describe('when the ticket request is valid', () => {
            it('does not throw an error', () => {
                const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
                expect(() => requestValidationService.ticketTypeRequestValidator([adultTicketRequest]))
                    .not.toThrow();
            });
        });
    });
    describe('when there are invalid parameters', () => {
        describe('when the account ID is missing or invalid', () => {
            //  TODO not sure if these are necessary as the 'TicketTypeRequest' validates whether accountId is an integer
            it('throws an error if the account ID is not a number', () => {
                expect(() => requestValidationService.requestIdValidator('not a number'))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER));
            });
            it('throws an error if the account ID is a floating point number', () => {
                expect(() => requestValidationService.requestIdValidator(1.5))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER));
            });
            it('throws an error if the account ID is 0', () => {
                expect(() => requestValidationService.requestIdValidator(0))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_LESS_THAN_ONE));
            });
            it('throws an error if an account ID is not provided', () => {
                expect(() => requestValidationService.requestIdValidator(null))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_NOT_PROVIDED));
            });
        });
        describe('When the ticket type request is missing or invalid', () => {
            it('throws an error if there are no tickets requested in the booking', () => {
                expect(() => requestValidationService.ticketTypeRequestValidator())
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.NO_TICKETS_IN_BOOKING));
            });
            it('throws an error if there are no tickets requested in the booking', () => {
                expect(() => requestValidationService.ticketTypeRequestValidator([]))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.NO_TICKETS_IN_BOOKING));
            });
            it('throws an error if there are more than 20 ticket requests in the booking', () => {
                const childTicketRequest = new TicketTypeRequest('CHILD', 18);
                const adultTicketRequest = new TicketTypeRequest('ADULT', 3);
                expect(() => requestValidationService.ticketTypeRequestValidator([childTicketRequest, adultTicketRequest]))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.NO_OF_TICKETS_OUTSIDE_BOUNDARIES));
            });
            it('throws an error if there are no adults in the booking', () => {
                const childTicketRequest = new TicketTypeRequest('CHILD', 1);
                const infantTicketRequest = new TicketTypeRequest('INFANT', 1);
                const adultTicketRequest = new TicketTypeRequest('ADULT', 0);
                expect(() => requestValidationService.ticketTypeRequestValidator([childTicketRequest, infantTicketRequest, adultTicketRequest]))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.NO_ADULTS_INCLUDED));
            });
            it('throws an error if there are more infants than ADULTS in the booking', () => {
                const childTicketRequest = new TicketTypeRequest('CHILD', 0);
                const infantTicketRequest = new TicketTypeRequest('INFANT', 3);
                const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
                expect(() => requestValidationService.ticketTypeRequestValidator([childTicketRequest, infantTicketRequest, adultTicketRequest]))
                    .toThrow(new InvalidPurchaseException(ERROR_MAP.NO_OF_ADULTS_LESS_THAN_NO_OF_INFANTS));
            });
        });
    });
});
