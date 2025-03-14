export interface CommissionReport {
  salesmanId: number;
  salesmanName: string;
  brandName: string;
  className: string;
  carsSold: number;
  modelPrice: number;
  totalSales: number;
  fixedCommission: number;
  classCommission: number;
  bonusCommission: number;
  totalCommission: number;
}

export interface CommissionSummary {
  salesmanId: number;
  salesmanName: string;
  totalCarsSold: number;
  totalSalesAmount: number;
  totalFixedCommission: number;
  totalClassCommission: number;
  totalBonusCommission: number;
  grandTotalCommission: number;
}

export interface CommissionReportRequest {
  month?: number;
  year?: number;
}
