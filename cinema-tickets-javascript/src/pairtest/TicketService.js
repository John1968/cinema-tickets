// import TicketTypeRequest from './lib/TicketTypeRequest.js';
// import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService';
import logger from '../pairtest/lib/logger'
import CalculationService from './lib/CalculationService.js';
import RequestValidationService from './lib/RequestValidationService';
import InvalidPurchaseException from './lib/InvalidPurchaseException';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #calculationService
  #seatReservationService
  #requestValidationService
  #ticketPaymentService

  constructor() {
    this.#calculationService = new CalculationService();
    this.#seatReservationService = new SeatReservationService();
    this.#requestValidationService = new RequestValidationService()
    this.#ticketPaymentService = new TicketPaymentService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // build the request
    const ticketsByType = this.#calculationService.getTotalTicketsByType(ticketTypeRequests);
    console.log(` XXX ${JSON.stringify(ticketsByType)}`)
    logger.info(`About to validate ticket request for Account: ${accountId}. Booking comprises ${ticketsByType.ADULT} adult(s), ${ticketsByType.CHILD} child(ren) and ${ticketsByType.INFANT} infant(s)`)
    // validate the request
    try {
      this.#requestValidationService.requestIdValidator(accountId);
      this.#requestValidationService.ticketTypeRequestValidator(...ticketTypeRequests)
    } catch(err) {
      logger.error(err.message);
      throw new InvalidPurchaseException(err.message)
    }
    // reserve seats

    // make payment

    // throws InvalidPurchaseException
  }
}
