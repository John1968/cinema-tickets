import { BASE_RESERVATION_OBJECT, TICKET_COST_BY_TYPE } from './Config';
import logger from '../lib/logger'
export default class CalculationService {

    getTotalTicketsByType(ticketTypeRequests) {
        const newTicketRequestObject = structuredClone(BASE_RESERVATION_OBJECT);
        ticketTypeRequests.forEach((request) => newTicketRequestObject[request.getTicketType()] += request.getNoOfTickets());
        return newTicketRequestObject;
    };
    getTotalTicketCount(ticketsByType) {
        return Object.values(ticketsByType).reduce((total, value) => total + value, 0);
    };
    getTotalSeats (ticketsByType) {
        return ticketsByType.ADULT + ticketsByType.CHILD;
    };
    getTotalBookingCost (ticketTypeRequests) {
        const ticketsByType = this.getTotalTicketsByType(ticketTypeRequests);
        const costsPerType = Object.fromEntries(
            Object.entries(ticketsByType).map(([key, val]) => [key, val * TICKET_COST_BY_TYPE[key]]),
        );
        const cost = Object.values(costsPerType).reduce((a, b) => a + b, 0);
        logger.info(`COST BY TYPE: ${JSON.stringify(costsPerType)}, TOTAL: ${cost}`);
        return cost;
    };
};
