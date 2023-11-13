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
}
