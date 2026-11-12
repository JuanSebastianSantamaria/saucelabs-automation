export interface BookingDatesDto {
  checkin: string;
  checkout: string;
}

export interface BookingDto {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDatesDto;
  additionalneeds: string;
}

export interface CreateBookingResponseDto {
  bookingid: number;
  booking: BookingDto;
}
