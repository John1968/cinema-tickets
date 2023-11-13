import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService';
import logger from '../pairtest/lib/logger'
import CalculationService from "./lib/Calculators.js";
export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #calculationService
  #logger
  #seatReservationService
  #ticketPaymentService

  constructor() {
    this.#calculationService = new CalculationService();
    this.#logger = logger;
    this.#seatReservationService = new SeatReservationService();
    this.#ticketPaymentService = new TicketPaymentService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // build the request
    const ticketByType = this.#calculationService.getTotalTicketsByType(ticketTypeRequests)
    // validate the request

    // reserve seats

    // make payment

    // throws InvalidPurchaseException
  }
}
