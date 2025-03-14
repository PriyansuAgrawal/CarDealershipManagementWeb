export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface PagedResponse<T> extends ApiResponse<T[]> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
