export const delay = (ms: number = 250): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const createResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  success: true,
  message,
});
