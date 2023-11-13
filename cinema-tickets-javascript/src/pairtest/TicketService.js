// import TicketTypeRequest from './lib/TicketTypeRequest.js';
// import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService';
import logger from '../pairtest/lib/logger'
import CalculationService from './lib/CalculationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #calculationService
  #seatReservationService
  #ticketPaymentService

  constructor() {
    this.#calculationService = new CalculationService();
    this.#seatReservationService = new SeatReservationService();
    this.#ticketPaymentService = new TicketPaymentService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // build the request
    const ticketsByType = this.#calculationService.getTotalTicketsByType(ticketTypeRequests);
    logger.info(`About to validate ticket request for Account:${accountId}. Booking comprises ${ticketsByType.ADULT.type} adult(s), ${ticketsByType.CHILD.type} child(ren) and ${ticketsByType.INFANT.type} infant(s)`)
    // validate the request

    // reserve seats

    // make payment

    // throws InvalidPurchaseException
  }
}
