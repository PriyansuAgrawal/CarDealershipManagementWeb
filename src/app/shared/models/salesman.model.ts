export interface Salesman {
  salesmanId: number;
  name: string;
  previousYearSales: number;
  createdDate: Date;
}

export interface SalesRecord {
  recordId: number;
  salesmanId: number;
  salesmanName: string;
  brandId: number;
  brandName: string;
  classId: number;
  className: string;
  numberOfCarsSold: number;
  saleMonth: number;
  saleYear: number;
}

export interface SalesRecordRequest {
  salesmanId: number;
  brandId: number;
  classId: number;
  numberOfCarsSold: number;
  month: number;
  year: number;
}
export interface SalesmanRequest {
  salesmanId?: number;
  name: string;
  previousYearSales: number;
}



