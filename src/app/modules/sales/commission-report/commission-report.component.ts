import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../../shared/services/report.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CommissionReport, CommissionSummary } from '../../../shared/models/commission.model';

@Component({
  selector: 'app-commission-report',
  templateUrl: './commission-report.component.html',
  styleUrls: ['./commission-report.component.scss']
})
export class CommissionReportComponent implements OnInit {
  filterForm: FormGroup;
  detailsDataSource = new MatTableDataSource<CommissionReport>();
  summaryDataSource = new MatTableDataSource<CommissionSummary>();
  isLoading = false;

  detailsColumns: string[] = [
    'salesmanName', 'brandName', 'className', 'carsSold',
    'modelPrice', 'totalSales', 'fixedCommission',
    'classCommission', 'bonusCommission', 'totalCommission'
  ];

  summaryColumns: string[] = [
    'salesmanName', 'totalCarsSold', 'totalSalesAmount',
    'totalFixedCommission', 'totalClassCommission',
    'totalBonusCommission', 'grandTotalCommission'
  ];

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  years: number[] = [];
  currentDate = new Date();

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {
    // Generate years from current year to 5 years back
    const currentYear = this.currentDate.getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.initFilterForm();
    this.generateReport();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      month: [this.currentDate.getMonth() + 1],
      year: [this.currentDate.getFullYear()]
    });
  }

  generateReport(): void {
    this.isLoading = true;
    const { month, year } = this.filterForm.value;

    this.reportService.getCommissionReport(month, year).subscribe({
      next: (response) => {
        if (response.success) {
          this.detailsDataSource.data = response?.data?.details;
          this.summaryDataSource.data = response?.data?.summary;
        } else {
          this.notificationService.showError(response.message);
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to generate commission report');
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.initFilterForm();
    this.generateReport();
  }

  // Helper functions for footer totals
  getTotalCarsSold(): number {
    return this.detailsDataSource.data?.reduce((total, item) => total + item.carsSold, 0);
  }

  getTotalSales(): number {
    return this.detailsDataSource.data?.reduce((total, item) => total + item.totalSales, 0);
  }

  getTotalFixedCommission(): number {
    return this.detailsDataSource.data?.reduce((total, item) => total + item.fixedCommission, 0);
  }

  getTotalClassCommission(): number {
    return this.detailsDataSource.data?.reduce((total, item) => total + item.classCommission, 0);
  }

  getTotalBonusCommission(): number {
    return this.detailsDataSource.data?.reduce((total, item) => total + item.bonusCommission, 0);
  }

  getTotalCommission(): number {
    return this.detailsDataSource.data?.reduce((total, item) => total + item.totalCommission, 0);
  }

  getSummaryTotalCars(): number {
    return this.summaryDataSource.data?.reduce((total, item) => total + item.totalCarsSold, 0);
  }

  getSummaryTotalSales(): number {
    return this.summaryDataSource.data?.reduce((total, item) => total + item.totalSalesAmount, 0);
  }

  getSummaryTotalFixedCommission(): number {
    return this.summaryDataSource.data?.reduce((total, item) => total + item.totalFixedCommission, 0);
  }

  getSummaryTotalClassCommission(): number {
    return this.summaryDataSource.data?.reduce((total, item) => total + item.totalClassCommission, 0);
  }

  getSummaryTotalBonusCommission(): number {
    return this.summaryDataSource.data?.reduce((total, item) => total + item.totalBonusCommission, 0);
  }

  getSummaryTotalCommission(): number {
    return this.summaryDataSource.data?.reduce((total, item) => total + item.grandTotalCommission, 0);
  }

  exportToPdf(): void {
    this.notificationService.showInfo('PDF export functionality will be implemented here');
  }

  exportToExcel(): void {
    this.notificationService.showInfo('Excel export functionality will be implemented here');
  }
}
