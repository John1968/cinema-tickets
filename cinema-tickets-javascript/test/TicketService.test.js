// noinspection JSCheckFunctionSignatures

import { afterAll, beforeAll, expect, jest } from'@jest/globals';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';
import TicketService from '../src/pairtest/TicketService';
import CalculationService from '../src/pairtest/lib/CalculationService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import logger from '../src/pairtest/lib/logger'
import { ERROR_MAP } from '../src/pairtest/lib/Config';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService';
import CurrencyService from '../src/pairtest/lib/CurrencyService';


jest.mock('../src/pairtest/lib/logger');
jest.mock('../src/pairtest/lib/CalculationService');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');
jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/pairtest/lib/CurrencyService');
describe('#TicketService', () => {
    let ticketService;
    describe('building the ticket request object', () => {
        let fakeTicketTypeRequest;
        let getTotalTicketsByTypeMock
        beforeAll(() => {
            jest.clearAllMocks();
            ticketService = new TicketService();
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            getTotalTicketsByTypeMock = jest
                .spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });

            jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
                .mockImplementation(() => {});
            const accountId = 12345
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
            const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 1);
            const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 1);
            fakeTicketTypeRequest = [fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest]
            ticketService.purchaseTickets(accountId, fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest);
        });
        afterAll(() => {
            jest.resetAllMocks()
        })
        it('should call getTotalTicketsByType to get a ticket request object', () => {
            expect(getTotalTicketsByTypeMock).toHaveBeenCalledWith(fakeTicketTypeRequest)
        });
        it('log the booking details before calling the validation service', () => {
           expect(logger.info).toHaveBeenCalledWith('About to validate ticket request for Account: 12345. Booking comprises 1 adult(s), 0 child(ren) and 0 infant(s)')
        });
    });
    describe('accountIdValidation', () => {
        beforeEach(() => {
            ticketService = new TicketService();
            jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
                .mockImplementation(() => {});
        });
        describe('accountId is a valid number', () => {
            it('should not throw an error if the account ID is a number greater than 0', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const accountId = 1;
                const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
                const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 1);
                const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 1);
                const fakeTicketTypeRequest = [fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest]
                expect(() => ticketService.purchaseTickets(accountId, fakeTicketTypeRequest)).not.toThrow()
            });
        });
        describe('accountId is NOT valid', () => {
            it('should throw an InvalidPurchaseException when the accountId < 1', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const accountId = 0;
                const ticketService = new TicketService()
                expect(() => ticketService.purchaseTickets(accountId)).toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_LESS_THAN_ONE))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.ACCOUNT_ID_LESS_THAN_ONE);
            });
            it('should throw an InvalidPurchaseException when the accountId is not a number', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const accountId = 'not-a-number';
                const ticketService = new TicketService()
                expect(() => ticketService.purchaseTickets(accountId)).toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.ACCOUNT_ID_IS_NOT_A_NUMBER);
            });
            it('should throw an InvalidPurchaseException when the accountId is not provided', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const ticketService = new TicketService()
                expect(() => ticketService.purchaseTickets(null)).toThrow(new InvalidPurchaseException(ERROR_MAP.ACCOUNT_ID_NOT_PROVIDED))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.ACCOUNT_ID_NOT_PROVIDED);
            });
        });
    });
    describe('ticket type validation', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should throw an InvalidPurchaseException when there are no tickets requested', () => {
            const mockTicketsByType = {"ADULT": 0, "CHILD": 0, "INFANT": 0};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            const accountId = 12345;
            const ticketService = new TicketService()
            expect(() => ticketService.purchaseTickets(accountId, null)).toThrow(new InvalidPurchaseException(ERROR_MAP.NO_TICKETS_IN_BOOKING))
            expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.NO_TICKETS_IN_BOOKING);
        });
        it('should throw an InvalidPurchaseException when there a no adults in the booking', () => {
            const mockTicketsByType = {"ADULT": 0, "CHILD": 5, "INFANT": 0};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            const accountId = 12345;
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 0);
            const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 5);
            const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 0);
            const ticketService = new TicketService()
            expect(() => ticketService.purchaseTickets(accountId, fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest)).toThrow(new InvalidPurchaseException(ERROR_MAP.NO_ADULTS_INCLUDED))
            expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.NO_ADULTS_INCLUDED);
        });
        it('should throw an InvalidPurchaseException when there are more than 20 tickets requested', () => {
            const mockTicketsByType = {"ADULT": 8, "CHILD": 9, "INFANT": 4};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            jest.spyOn(CalculationService.prototype, 'getTotalTicketCount')
                .mockImplementation(() => {
                    return 21
                });
            const accountId = 12345;
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 8);
            const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 9);
            const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 4);
            const ticketService = new TicketService()
            expect(() => ticketService.purchaseTickets(accountId, fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest)).toThrow(new InvalidPurchaseException(ERROR_MAP.NO_OF_TICKETS_OUTSIDE_BOUNDARIES))
            expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.NO_OF_TICKETS_OUTSIDE_BOUNDARIES);
        });
        it('should throw an InvalidPurchaseException when there are more infants than adults', () => {
            const mockTicketsByType = {"ADULT": 3, "CHILD": 5, "INFANT": 5};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            const accountId = 12345;
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 0);
            const fakeChildTicketRequest = new TicketTypeRequest('CHILD', 5);
            const fakeInfantTicketRequest = new TicketTypeRequest('INFANT', 0);
            const ticketService = new TicketService()
            expect(() => ticketService.purchaseTickets(accountId, fakeAdultTicketRequest, fakeChildTicketRequest, fakeInfantTicketRequest)).toThrow(new InvalidPurchaseException(ERROR_MAP.NO_OF_ADULTS_LESS_THAN_NO_OF_INFANTS))
            expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.NO_OF_ADULTS_LESS_THAN_NO_OF_INFANTS);
        });
    });
    describe('reserving the correct number of seats', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            ticketService = new TicketService();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('reserves a seat for each adult and child', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const getTotalSeatsMock = jest
                    .spyOn(CalculationService.prototype, 'getTotalSeats')
                    .mockImplementation(() => {
                        return 2;
                    });
                const seatReservationServiceMock = jest
                    .spyOn(SeatReservationService.prototype, 'reserveSeat')
                    .mockImplementation(() => {});
                const accountId = 111;
                const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 2);
                const expectedSeatReservations = 2
                ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)
                expect(getTotalSeatsMock).toHaveBeenCalledWith(mockTicketsByType);
                expect(logger.info).toHaveBeenNthCalledWith(2, `about to reserve ${expectedSeatReservations} seat(s) for account ${accountId}`);
                expect(seatReservationServiceMock).toHaveBeenCalledWith(accountId, expectedSeatReservations)
        });
        it('throws an error if the number of seats is not an integer', () => {
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
            });
            jest.spyOn(CalculationService.prototype, 'getTotalSeats')
                .mockImplementation(() => {
                    return 'fake-string';
            });
            jest.spyOn(SeatReservationService.prototype, 'reserveSeat').mockImplementation(() => {
                throw new InvalidPurchaseException(ERROR_MAP.NO_OF_SEATS_IS_NOT_AN_INTEGER)
            });

            const accountId = 12345
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
            expect(() => ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)).toThrow(new InvalidPurchaseException(ERROR_MAP.NO_OF_SEATS_IS_NOT_AN_INTEGER))
            expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.NO_OF_SEATS_IS_NOT_AN_INTEGER);
        });
    });
    describe('calculating the cost of the booking', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            ticketService = new TicketService();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('calculates the cost of the booking', () => {
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
           jest.spyOn(CalculationService.prototype, 'getTotalSeats')
                .mockImplementation(() => {
                    return 2;
                });
           const mockTotalTickets = 2
            const getTotalTicketsTicketCount = jest
                .spyOn(CalculationService.prototype, 'getTotalTicketCount')
                .mockImplementation(() => {
                    return mockTotalTickets
                })
            const mockTotalCost = 20
            const getTotalBookingCostMock = jest
                .spyOn(CalculationService.prototype, 'getTotalBookingCost')
                .mockImplementation(() => {
                    return mockTotalCost
                })
            jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
                .mockImplementation(() => {});
            const accountId = 111;
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 2);
            ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)
            expect(getTotalTicketsTicketCount).toHaveBeenCalledWith(mockTicketsByType);
            expect(logger.info).toHaveBeenNthCalledWith(3, `About to purchase ${mockTotalTickets} tickets`);
            expect(getTotalBookingCostMock).toHaveBeenCalledWith(mockTicketsByType)
        });
    });
    describe('paying for a booking', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            ticketService = new TicketService();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('pays the correct amount for the booking', () => {
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            jest.spyOn(CalculationService.prototype, 'getTotalSeats')
                .mockImplementation(() => {
                    return 2;
                });
            const mockTotalCost = 20
            jest.spyOn(CalculationService.prototype, 'getTotalBookingCost')
                .mockImplementation(() => {
                    return mockTotalCost
                })
            jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
                .mockImplementation(() => {});
            const ticketPaymentServiceMock = jest
                .spyOn(TicketPaymentService.prototype, 'makePayment')
                .mockImplementation(() => {});
            const accountId = 111;
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 2);
            ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)
            expect(ticketPaymentServiceMock).toHaveBeenCalledWith(accountId, mockTotalCost)
        });
        it('throws an error if the number of seats is not an integer', () => {
            const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
            jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                .mockImplementation(() => {
                    return mockTicketsByType
                });
            jest.spyOn(CalculationService.prototype, 'getTotalSeats')
                .mockImplementation(() => {
                    return 'fake-string';
                });
            jest.spyOn(TicketPaymentService.prototype, 'makePayment').mockImplementation(() => {
                throw new InvalidPurchaseException(ERROR_MAP.NO_OF_SEATS_IS_NOT_AN_INTEGER)
            });

            const accountId = 12345
            const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
            expect(() => ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)).toThrow(new InvalidPurchaseException(ERROR_MAP.NO_OF_SEATS_IS_NOT_AN_INTEGER))
            expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.NO_OF_SEATS_IS_NOT_AN_INTEGER);
        });
        describe('converting cost integer to a currency', () => {
            beforeEach(() => {
                jest.clearAllMocks()
                ticketService = new TicketService();
            });
            afterEach(() => {
                jest.resetAllMocks();
            });
            it('return a currency value to two decimals and confirms the booking', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                const mockTotalSeats = 2
                jest.spyOn(CalculationService.prototype, 'getTotalSeats')
                    .mockImplementation(() => {
                        return mockTotalSeats;
                    });
                const mockTotalCost = 20
                jest.spyOn(CalculationService.prototype, 'getTotalBookingCost')
                    .mockImplementation(() => {
                        return mockTotalCost
                    })
                jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
                    .mockImplementation(() => {});
                jest.spyOn(TicketPaymentService.prototype, 'makePayment')
                    .mockImplementation(() => {});
                const fakeCost = `£${mockTotalCost}.00`
                const currencyServiceMock = jest
                    .spyOn(CurrencyService.prototype, 'getPriceInPounds')
                    .mockImplementation(() => {
                        return fakeCost
                    })
                const accountId = 111;
                const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 2);
                ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)
                expect(currencyServiceMock).toHaveBeenCalledWith(mockTotalCost);
                expect(logger.info).toHaveBeenNthCalledWith(5, `${mockTotalSeats} seat(s) have been reserved\n The booking is confirmed at a cost of ${fakeCost}`)
            });
            it('throws an error if the amount is not a number', () => {
                const mockTicketsByType = {"ADULT": 1, "CHILD": 0, "INFANT": 0};
                jest.spyOn(CalculationService.prototype, 'getTotalTicketsByType')
                    .mockImplementation(() => {
                        return mockTicketsByType
                    });
                jest.spyOn(CalculationService.prototype, 'getTotalSeats')
                    .mockImplementation(() => {
                        return 'fake-string';
                    });
                jest.spyOn(TicketPaymentService.prototype, 'makePayment')
                    .mockImplementation(() => {});
                jest.spyOn(CurrencyService.prototype, 'getPriceInPounds')
                    .mockImplementation(() => {
                        throw new InvalidPurchaseException(ERROR_MAP.COST_NOT_AN_INTEGER)
                    })
                const accountId = 12345
                const fakeAdultTicketRequest = new TicketTypeRequest('ADULT', 1);
                expect(() => ticketService.purchaseTickets(accountId, fakeAdultTicketRequest)).toThrow(new InvalidPurchaseException(ERROR_MAP.COST_NOT_AN_INTEGER))
                expect(logger.error).toHaveBeenCalledWith(ERROR_MAP.COST_NOT_AN_INTEGER);
            });
        });
    });
});
