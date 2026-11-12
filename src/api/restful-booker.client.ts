import type { AuthRequestDto, AuthResponseDto } from './dto/auth.dto.js';
import type { BookingDto, CreateBookingResponseDto } from './dto/booking.dto.js';

export interface ApiResponse<T> {
  status: number;
  body: T;
}

export class RestfulBookerClient {
  constructor(private readonly baseUrl: string) {}

  async generateAuth(credentials: AuthRequestDto): Promise<ApiResponse<AuthResponseDto>> {
    return this.request<AuthResponseDto>('/auth', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async createBooking(booking: BookingDto): Promise<ApiResponse<CreateBookingResponseDto>> {
    return this.request<CreateBookingResponseDto>('/booking', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getBooking(id: number): Promise<ApiResponse<BookingDto>> {
    return this.request<BookingDto>(`/booking/${id}`, { method: 'GET' });
  }

  async updateBooking(
    id: number,
    token: string,
    booking: BookingDto,
  ): Promise<ApiResponse<BookingDto>> {
    return this.request<BookingDto>(`/booking/${id}`, {
      method: 'PUT',
      headers: { Cookie: `token=${token}` },
      body: JSON.stringify(booking),
    });
  }

  async deleteBooking(id: number, token: string): Promise<ApiResponse<string>> {
    return this.request<string>(`/booking/${id}`, {
      method: 'DELETE',
      headers: { Cookie: `token=${token}` },
    });
  }

  private async request<T>(
    path: string,
    options: { method: string; headers?: Record<string, string>; body?: string },
  ): Promise<ApiResponse<T>> {
    const response = await fetch(new URL(path, this.baseUrl), {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? ((await response.json()) as T)
      : ((await response.text()) as T);

    return { status: response.status, body };
  }
}
