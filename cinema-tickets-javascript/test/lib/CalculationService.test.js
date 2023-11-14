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
    describe('#getTotalTicketCount', () => {
        const ticketsByType = {"ADULT": 2, "CHILD": 0, "INFANT": 1};
        const result = calculationService.getTotalTicketCount(ticketsByType);
        it('should return the total number of tickets', () => {
            expect(result).toEqual(3);
        });
    });
    describe('getTotalSeats', () => {
        it('books 1 seat for each ADULT', () => {
            const ticketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            const result = calculationService.getTotalSeats(ticketsByType);
            expect(result).toEqual(1);
        });
        it('books 1 seat for each CHILD', () => {
            const ticketsByType = {"ADULT": 0, "CHILD": 1, "INFANT": 0};
            const result = calculationService.getTotalSeats(ticketsByType);
            expect(result).toEqual(1);
        });
        it('books 0 seats for INFANT', () => {
            const ticketsByType = {"ADULT": 0, "CHILD": 0, "INFANT": 1};
            const result = calculationService.getTotalSeats(ticketsByType);
            expect(result).toEqual(0);
        });
        it('books the correct seat total for a mixed booking', () => {
            const ticketsByType = {"ADULT": 3, "CHILD": 2, "INFANT": 1};
            const result = calculationService.getTotalSeats(ticketsByType);
            expect(result).toEqual(5);
        });
    })

    describe('#getTotalBookingCost', () => {
        const adultTicketRequest = new TicketTypeRequest('ADULT', 1);
        const childTicketRequest = new TicketTypeRequest('CHILD', 1);
        const infantTicketRequest = new TicketTypeRequest('INFANT', 1);
        const costOfAdultTicket = 20;
        const costOfChildTicket = 10;
        const costOfInfantTicket = 0;
        describe('charges the correct amount for an ADULT', () =>{
            const requestForOneAdultTicket = [adultTicketRequest];
            const result = calculationService.getTotalBookingCost(requestForOneAdultTicket);
            it('should return a the correct cost for an adult', () => {
                expect(result).toEqual(costOfAdultTicket);
            });
        });
        describe('it charges the correct amount for a CHILD', () => {
            const requestForOneChildTicket = [childTicketRequest];
            const result = calculationService.getTotalBookingCost(requestForOneChildTicket);
            it('should return a the correct cost for a child', () => {
                expect(result).toEqual(costOfChildTicket);
            });
        });
        describe('it charges the correct amount for an INFANT', () => {
            const requestForOneInfantTicket = [infantTicketRequest];
            const result = calculationService.getTotalBookingCost(requestForOneInfantTicket);
            it('should return a the correct cost for an infant', () => {
                expect(result).toEqual(costOfInfantTicket);
            });
        });
        describe('it charges the correct amount for an multiple ticket types', () => {
            const requestForOneInfantTicket = [adultTicketRequest, childTicketRequest, infantTicketRequest];
            const result = calculationService.getTotalBookingCost(requestForOneInfantTicket);
            it('should return a the correct cost for an infant', () => {
                expect(result).toEqual(costOfAdultTicket + costOfChildTicket + costOfInfantTicket);
            });
        });
    });
});
