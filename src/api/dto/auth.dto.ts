export interface AuthRequestDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  token?: string;
  reason?: string;
}
