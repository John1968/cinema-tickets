export const LOGGING_LEVEL = 'info';

export const BASE_RESERVATION_OBJECT = {
    ADULT: 0,
    CHILD: 0,
    INFANT: 0,
};

export const TICKET_BOOKING_CONSTANTS = {
    ADULT: {type: 'ADULT', cost: 20},
    CHILD: {type: 'CHILD', cost: 10},
    INFANT: {type: 'INFANT', cost: 0},
};

export const MAX_TICKETS = 20;
export const MIN_TICKETS = 1;
export const ERROR_MAP = {
    ACCOUNT_ID_LESS_THAN_ONE: 'The account ID must be greater than 0',
    ACCOUNT_ID_IS_NOT_A_NUMBER: 'The account ID must be an integer',
    ACCOUNT_ID_NOT_PROVIDED: 'An account ID must be provided',
    NO_TICKETS_IN_BOOKING: 'There must be a minimum of 1 ticket per booking',
    NO_OF_TICKETS_OUTSIDE_BOUNDARIES: `Your reservation must be for between ${MIN_TICKETS} and ${MAX_TICKETS} tickets.`,
    NO_ADULTS_INCLUDED: 'Your reservation must contain at least 1 adult',
    NO_OF_ADULTS_LESS_THAN_NO_OF_INFANTS:'There must be an ADULT for every INFANT in the booking',
    NO_OF_SEATS_IS_NOT_AN_INTEGER: 'totalSeatsToAllocate must be an integer',
}
export const TICKET_COST_BY_TYPE = {
    ADULT: 20,
    CHILD: 10,
    INFANT: 0,
};
