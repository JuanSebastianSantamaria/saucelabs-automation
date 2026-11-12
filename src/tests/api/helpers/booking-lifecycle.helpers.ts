export function requireToken(token: string | undefined): string {
  if (!token) {
    throw new Error('Auth token is unavailable; the authentication test must pass first.');
  }
  return token;
}

export function requireBookingId(bookingId: number | undefined): number {
  if (bookingId === undefined) {
    throw new Error('Booking ID is unavailable; the create booking test must pass first.');
  }
  return bookingId;
}
