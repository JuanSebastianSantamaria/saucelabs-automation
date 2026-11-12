import assert from 'node:assert/strict';
import { RestfulBookerClient } from '../../api/restful-booker.client.js';
import { config } from '../../config/environment.js';
import { authRequestData, createBookingData, updateBookingData } from '../../data/api-test-data.js';
import { requireBookingId, requireToken } from './helpers/booking-lifecycle.helpers.js';

describe('Restful Booker booking lifecycle', function () {
  const client = new RestfulBookerClient(config.apiBaseUrl);
  const booking = createBookingData();
  let token: string | undefined;
  let bookingId: number | undefined;

  it('generates an auth token and returns status 200', async () => {
    const authResponse = await client.generateAuth(authRequestData);

    assert.equal(authResponse.status, 200, 'authentication should return 200');
    assert.ok(authResponse.body.token, 'authentication response should include a token');
    token = authResponse.body.token;
  });

  it('creates a booking and returns status 200', async () => {
    const newBookingResponse = await client.createBooking(booking);

    assert.equal(newBookingResponse.status, 200, 'booking creation should return 200');
    assert.ok(newBookingResponse.body.bookingid > 0, 'creation response should include a booking ID');
    assert.deepEqual(newBookingResponse.body.booking, booking, 'creation response should match the request');
    bookingId = newBookingResponse.body.bookingid;
  });

  it('reads the booking and matches the request data', async () => {
    const getBookingResponse = await client.getBooking(requireBookingId(bookingId));
    assert.equal(getBookingResponse.status, 200, 'reading the created booking should return 200');
    assert.deepEqual(getBookingResponse.body, booking, 'read response should match the created booking');
  });

  it('updates the checkout date and validates the response', async () => {
    const updatedBooking = updateBookingData(booking);
    const updatedBookingResponse = await client.updateBooking(
      requireBookingId(bookingId),
      requireToken(token),
      updatedBooking,
    );
    assert.equal(updatedBookingResponse.status, 200, 'booking update should return 200');
    assert.deepEqual(updatedBookingResponse.body, updatedBooking, 'update response should include the new checkout');
  });

  it('deletes the booking with status 201 and confirms GET returns 404', async () => {
    const id = requireBookingId(bookingId);
    const deleteResponse = await client.deleteBooking(id, requireToken(token));
    assert.equal(deleteResponse.status, 201, 'booking deletion should return 201');

    const afterDelete = await client.getBooking(id);
    assert.equal(afterDelete.status, 404, 'deleted booking should no longer be found');
  });
});
