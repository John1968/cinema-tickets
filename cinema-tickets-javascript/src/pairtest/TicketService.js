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
  #seatsRequired
  #ticketsByType
  #ticketPaymentService
  #totalTicketsToPurchase
  #totalAmountToPay

  constructor() {
    this.#calculationService = new CalculationService();
    this.#seatReservationService = new SeatReservationService();
    this.#requestValidationService = new RequestValidationService()
    this.#ticketPaymentService = new TicketPaymentService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // build the request
    this.#ticketsByType = this.#calculationService.getTotalTicketsByType(ticketTypeRequests);
    console.log(` XXX ${JSON.stringify(this.#ticketsByType)}`)
    logger.info(`About to validate ticket request for Account: ${accountId}. Booking comprises ${this.#ticketsByType.ADULT} adult(s), ${this.#ticketsByType.CHILD} child(ren) and ${this.#ticketsByType.INFANT} infant(s)`)

    try {
      // validate the request
      this.#requestValidationService.requestIdValidator(accountId);
      this.#requestValidationService.ticketTypeRequestValidator(...ticketTypeRequests);

      // reserve seats
      this.#seatsRequired = this.#calculationService.getTotalSeats(this.#ticketsByType);
      logger.info(`about to reserve ${this.#seatsRequired} seat(s) for account ${accountId}`);
      this.#seatReservationService.reserveSeat(accountId, this.#seatsRequired);

      // calculate cost
      this.#totalTicketsToPurchase = this.#calculationService.getTotalTicketCount(this.#ticketsByType);
      logger.info(`About to purchase ${this.#totalTicketsToPurchase} tickets`);
      this.#totalAmountToPay = this.#calculationService.getTotalBookingCost( this.#ticketsByType );

      // make payment

    } catch(err) {
      logger.error(err.message);
      throw new InvalidPurchaseException(err.message)
    }
  }
}
