import { BASE_RESERVATION_OBJECT } from '../lib/Config';
// import logger from '../lib/logger';
export default class CalculationService {

    getTotalTicketsByType(ticketTypeRequests) {
        const newTicketRequestObject = {...BASE_RESERVATION_OBJECT};
        ticketTypeRequests.forEach((request) => newTicketRequestObject[request.getTicketType()] += request.getNoOfTickets());
        return newTicketRequestObject;
    };

};
