import InvalidPurchaseException from '../lib/InvalidPurchaseException';
import CalculationService from './CalculationService';
import { MAX_TICKETS, MIN_TICKETS, ERROR_MAP } from './Config.js';

export default class RequestValidationService {
    requestIdValidator(accountId) {
        let message
        if (!Number.isInteger(accountId)) {
            message = ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER;
        }
        if(accountId < 1) {
            message = ERROR_MAP.ACCOUNT_ID_LESS_THAN_ONE;
        }
        if(accountId === null) {
            message = ERROR_MAP.ACCOUNT_ID_NOT_PROVIDED;
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
            message = ERROR_MAP.NO_TICKETS_IN_BOOKING;
        } else {
            ticketsByType = this.calculationService.getTotalTicketsByType(ticketTypeRequests);
            totalTicketsRequired = this.calculationService.getTotalTicketCount(ticketsByType);
            if(totalTicketsRequired > MAX_TICKETS || totalTicketsRequired < MIN_TICKETS) {
                message = ERROR_MAP.NO_OF_TICKETS_OUTSIDE_BOUNDARIES;
            } else if(!ticketsByType.ADULT || ticketsByType.ADULT < MIN_TICKETS) {
                message = ERROR_MAP.NO_ADULTS_INCLUDED;
            } else if(ticketsByType.ADULT < ticketsByType.INFANT) {
                message = ERROR_MAP.NO_OF_ADULTS_LESS_THAN_NO_OF_INFANTS;
            }
        }
        if(message) {
            throw new InvalidPurchaseException(message);
        }
        return ticketsByType;
    };
};
