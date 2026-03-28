export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: any;
  };
}
