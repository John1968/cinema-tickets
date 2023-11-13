import { BASE_RESERVATION_OBJECT } from './Config';
// import logger from '../lib/logger';
export default class CalculationService {

    getTotalTicketsByType(ticketTypeRequests) {
        const newTicketRequestObject = {...BASE_RESERVATION_OBJECT};
        ticketTypeRequests.forEach((request) => newTicketRequestObject[request.getTicketType()] += request.getNoOfTickets());
        return newTicketRequestObject;
    };
    getTotalTicketCount(ticketsByType) {
        return Object.values(ticketsByType).reduce((total, value) => total + value, 0);
    };
};
