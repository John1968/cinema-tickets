import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService';
import logger from '../pairtest/lib/logger'
import CalculationService from './lib/CalculationService';
import RequestValidationService from './lib/RequestValidationService';
import InvalidPurchaseException from './lib/InvalidPurchaseException';
import CurrencyService from './lib/CurrencyService';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #calculationService
  #currencyService
  #priceInPounds
  #requestValidationService
  #seatsRequired
  #seatReservationService
  #ticketsByType
  #ticketPaymentService
  #totalTicketsToPurchase
  #totalAmountToPay

  constructor() {
    this.#calculationService = new CalculationService();
    this.#seatReservationService = new SeatReservationService();
    this.#requestValidationService = new RequestValidationService();
    this.#ticketPaymentService = new TicketPaymentService();
    this.#currencyService = new CurrencyService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // build the request
    this.#ticketsByType = this.#calculationService.getTotalTicketsByType(ticketTypeRequests);
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
      this.#ticketPaymentService.makePayment(accountId, this.#totalAmountToPay);

      // convert cost to currency
      this.#priceInPounds = this.#currencyService.getPriceInPounds(this.#totalAmountToPay);
      logger.info(this.#priceInPounds);

      //  confirm booking
      logger.info(`${this.#seatsRequired} seat(s) have been reserved\n The booking is confirmed at a cost of ${this.#priceInPounds}`)

    } catch(err) {
      logger.error(err.message);
      throw new InvalidPurchaseException(err.message)
    }
  }
}
