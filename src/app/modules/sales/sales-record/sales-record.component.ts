import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SalesmanService } from '../../../shared/services/salesman.service';
import { CarModelService } from '../../../shared/services/car-model.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SalesRecord, Salesman } from '../../../shared/models/salesman.model';
import { Brand, Class } from '../../../shared/models/car-model.model';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss']
})
export class SalesRecordComponent implements OnInit {
  filterForm: FormGroup;
  recordForm: FormGroup;
  dataSource = new MatTableDataSource<SalesRecord>();
  isLoading = false;
  isSubmitting = false;

  displayedColumns: string[] = [
    'salesmanName', 'brandName', 'className',
    'numberOfCarsSold', 'actions'
  ];

  salesmen: Salesman[] = [];
  brands: Brand[] = [];
  classes: Class[] = [];

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

  selectedRecord: SalesRecord | null = null;

  constructor(
    private fb: FormBuilder,
    private salesmanService: SalesmanService,
    private carModelService: CarModelService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    // Generate years from current year to 5 years back
    const currentYear = this.currentDate.getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.initForms();
    this.loadDropdowns();
    this.loadSalesRecords();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      month: [this.currentDate.getMonth() + 1],
      year: [this.currentDate.getFullYear()]
    });

    this.recordForm = this.fb.group({
      salesmanId: ['', Validators.required],
      brandId: ['', Validators.required],
      classId: ['', Validators.required],
      numberOfCarsSold: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadDropdowns(): void {
    this.isLoading = true;

    // Load salesmen
    this.salesmanService.getSalesmen().subscribe({
      next: (response) => {
        if (response.success) {
          this.salesmen = response.data;
        } else {
          this.notificationService.showError('Failed to load salesmen');
        }
      },
      error: () => this.notificationService.showError('Failed to load salesmen')
    });

    // Load brands
    this.carModelService.getBrands().subscribe({
      next: (response) => {
        if (response.success) {
          this.brands = response.data;
        } else {
          this.notificationService.showError('Failed to load brands');
        }
      },
      error: () => this.notificationService.showError('Failed to load brands')
    });

    // Load classes
    this.carModelService.getClasses().subscribe({
      next: (response) => {
        if (response.success) {
          this.classes = response.data;
          this.isLoading = false;
        } else {
          this.notificationService.showError('Failed to load classes');
          this.isLoading = false;
        }
      },
      error: () => {
        this.notificationService.showError('Failed to load classes');
        this.isLoading = false;
      }
    });
  }

  loadSalesRecords(): void {
    this.isLoading = true;
    const { month, year } = this.filterForm.value;

    this.salesmanService.getSalesRecords(month, year).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.data;
        } else {
          this.notificationService.showError(response.message);
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load sales records');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      return;
    }

    const { month, year } = this.filterForm.value;
    const recordData = {
      ...this.recordForm.value,
      month,
      year
    };

    this.isSubmitting = true;

    this.salesmanService.upsertSalesRecord(recordData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Sales record saved successfully');
          this.recordForm.reset();
          this.selectedRecord = null;
          this.loadSalesRecords();
        } else {
          this.notificationService.showError(response.message);
        }
        this.isSubmitting = false;
      },
      error: () => {
        this.notificationService.showError('Failed to save sales record');
        this.isSubmitting = false;
      }
    });
  }

  editRecord(record: SalesRecord): void {
    this.selectedRecord = record;
    this.recordForm.patchValue({
      salesmanId: record.salesmanId,
      brandId: record.brandId,
      classId: record.classId,
      numberOfCarsSold: record.numberOfCarsSold
    });
  }

  cancelEdit(): void {
    this.selectedRecord = null;
    this.recordForm.reset();
  }

  applyFilter(): void {
    this.loadSalesRecords();
  }

  resetFilter(): void {
    this.filterForm.patchValue({
      month: this.currentDate.getMonth() + 1,
      year: this.currentDate.getFullYear()
    });
    this.loadSalesRecords();
  }

  populateSampleData(): void {
    const { month, year } = this.filterForm.value;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Populate Sample Data',
        message: `Are you sure you want to populate sample data for ${this.months.find(m => m.value === month)?.name} ${year}? This will overwrite any existing data for this period.`,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.salesmanService.populateSampleData(month, year).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showSuccess('Sample data populated successfully');
              this.loadSalesRecords();
            } else {
              this.notificationService.showError(response.message);
              this.isLoading = false;
            }
          },
          error: () => {
            this.notificationService.showError('Failed to populate sample data');
            this.isLoading = false;
          }
        });
      }
    });
  }
}
