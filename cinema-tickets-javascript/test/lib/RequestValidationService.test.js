import { expect } from'@jest/globals';
import RequestValidationService from '../../src/pairtest/lib/RequestValidationService';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';

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
                    .toThrow(new InvalidPurchaseException('The account ID must be an integer'));
            });
            it('throws an error if the account ID is a floating point number', () => {
                expect(() => requestValidationService.requestIdValidator(1.5))
                    .toThrow(new InvalidPurchaseException('The account ID must be an integer'));
            });
            it('throws an error if the account ID is 0', () => {
                expect(() => requestValidationService.requestIdValidator(0))
                    .toThrow(new InvalidPurchaseException('The account ID must be greater than 0'));
            });
            it('throws an error if an account ID is not provided', () => {
                expect(() => requestValidationService.requestIdValidator(null))
                    .toThrow(new InvalidPurchaseException('An account ID must be provided'));
            });
        });
        describe('When the ticket type request is missing or invalid', () => {
            it('throws an error if there are no tickets requested in the booking', () => {
                expect(() => requestValidationService.ticketTypeRequestValidator())
                    .toThrow(new InvalidPurchaseException('There must be a minimum of 1 ticket per booking'));
            });
            it('throws an error if there are no tickets requested in the booking', () => {
                expect(() => requestValidationService.ticketTypeRequestValidator([]))
                    .toThrow(new InvalidPurchaseException('There must be a minimum of 1 ticket per booking'));
            });
            it('throws an error if there are more than 20 ticket requests in the booking', () => {
                const childTicketRequest = new TicketTypeRequest('CHILD', 18);
                const adultTicketRequest = new TicketTypeRequest('ADULT', 3);
                const totalTicketsForBooking = childTicketRequest.getNoOfTickets() + adultTicketRequest.getNoOfTickets();
                expect(() => requestValidationService.ticketTypeRequestValidator([childTicketRequest, adultTicketRequest]))
                    .toThrow(new InvalidPurchaseException(`Your reservation must be for between 1 and 20 tickets. You requested ${totalTicketsForBooking}`));
            });
            it('throws an error if there are no adults in the booking', () => {
                const childTicketRequest = new TicketTypeRequest('CHILD', 1);
                const infantTicketRequest = new TicketTypeRequest('INFANT', 1);
                const adultTicketRequest = new TicketTypeRequest('ADULT', 0);
                expect(() => requestValidationService.ticketTypeRequestValidator([childTicketRequest, infantTicketRequest, adultTicketRequest]))
                    .toThrow(new InvalidPurchaseException('Your reservation must contain at least 1 adult'));
            });
            it('throws an error if there are more infants than ADULTS in the booking', () => {
                const childTicketRequest = new TicketTypeRequest('CHILD', 0);
                const infantTicketRequest = new TicketTypeRequest('INFANT', 3);
                const adultTicketRequest = new TicketTypeRequest('ADULT', 2);
                expect(() => requestValidationService.ticketTypeRequestValidator([childTicketRequest, infantTicketRequest, adultTicketRequest]))
                    .toThrow(new InvalidPurchaseException('There must be an ADULT for every INFANT in the booking'));
            });
        });
    });
});
