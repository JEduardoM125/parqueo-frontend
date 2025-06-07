export interface ApiResponse<T> {
 success: boolean;
 message: string;
 data: T;
 error?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}