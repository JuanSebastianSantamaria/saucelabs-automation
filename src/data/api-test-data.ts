import type { AuthRequestDto } from '../api/dto/auth.dto.js';
import type { BookingDto } from '../api/dto/booking.dto.js';
import { dateOffset } from '../utils/date.utils.js';

export const authRequestData: AuthRequestDto = {
  username: 'admin',
  password: 'password123',
};

export function createBookingData(): BookingDto {
  return {
    firstname: 'Jamie',
    lastname: 'Tester',
    totalprice: 215,
    depositpaid: true,
    bookingdates: { checkin: dateOffset(1), checkout: dateOffset(3) },
    additionalneeds: 'Breakfast',
  };
}

export function updateBookingData(booking: BookingDto): BookingDto {
  return {
    ...booking,
    bookingdates: { ...booking.bookingdates, checkout: dateOffset(4) },
  };
}
