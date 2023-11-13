import InvalidPurchaseException from '../lib/InvalidPurchaseException';
import CalculationService from './CalculationService';
import { MAX_TICKETS, MIN_TICKETS } from './Config.js';

export default class RequestValidationService {
    requestIdValidator(accountId) {
        let message
        if (!Number.isInteger(accountId)) {
            message = 'The account ID must be an integer';
        }
        if(accountId < 1) {
            message = 'The account ID must be greater than 0';
        }
        if(accountId === null) {
            message = 'An account ID must be provided';
        }
        if(message) {
            throw new InvalidPurchaseException(message);
        }
    };

    ticketTypeRequestValidator(ticketTypeRequests) {
        let message;
        let ticketsByType;
        let totalTicketsRequired;
        this.calculationService = new CalculationService();
        if(ticketTypeRequests == null || ticketTypeRequests.length === 0) {
            message = 'There must be a minimum of 1 ticket per booking';
        } else {
            ticketsByType = this.calculationService.getTotalTicketsByType(ticketTypeRequests);
            totalTicketsRequired = this.calculationService.getTotalTicketCount(ticketsByType);
            if(totalTicketsRequired > MAX_TICKETS || totalTicketsRequired < MIN_TICKETS) {
                message = `Your reservation must be for between ${MIN_TICKETS} and ${MAX_TICKETS} tickets.`;
            } else if(!ticketsByType.ADULT || ticketsByType.ADULT < MIN_TICKETS) {
                message = 'Your reservation must contain at least 1 adult';
            } else if(ticketsByType.ADULT < ticketsByType.INFANT) {
                message = 'There must be an ADULT for every INFANT in the booking';
            }
        }
        if(message) {
            throw new InvalidPurchaseException(message);
        }
        return ticketsByType;
    };
};
