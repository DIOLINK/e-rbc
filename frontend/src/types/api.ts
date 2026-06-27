export interface ApiError {
  status: number;
  error: string;
  message: string;
  details: Record<string, string> | null;
  timestamp: string | null;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}
