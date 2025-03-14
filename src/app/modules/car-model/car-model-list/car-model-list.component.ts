import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CarModelService } from '../../../shared/services/car-model.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CarModel } from '../../../shared/models/car-model.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-car-model-list',
  templateUrl: './car-model-list.component.html',
  styleUrls: ['./car-model-list.component.scss']
})
export class CarModelListComponent implements OnInit {
  displayedColumns: string[] = ['defaultImage', 'modelName', 'modelCode', 'brandName', 'className', 'price', 'dateOfManufacturing', 'isActive', 'actions'];
  dataSource: MatTableDataSource<CarModel> = new MatTableDataSource<CarModel>();
  searchTerm: string = '';
  orderBy: string = 'DateOfManufacturing DESC';
  isLoading = false;
  imageBaseUrl = environment.imageBaseUrl
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private carModelService: CarModelService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCarModels();
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadCarModels(): void {
    this.isLoading = true;
    this.carModelService.getCarModels(this.searchTerm, this.orderBy)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource.data = response.data;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.notificationService.showError(response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to load car models');
          this.isLoading = false;
        }
      });
  }

  applyFilter(): void {
    this.loadCarModels();
  }

  resetFilter(): void {
    this.searchTerm = '';
    this.orderBy = 'DateOfManufacturing DESC';
    this.loadCarModels();
  }

  editCarModel(id: number): void {
    this.router.navigate(['/dashboard/cars/edit', id]);
  }

  viewCarModel(id: number): void {
    this.router.navigate(['/dashboard/cars/view', id]);
  }

  deleteCarModel(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this car model? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.carModelService.deleteCarModel(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showSuccess('Car model deleted successfully');
              this.loadCarModels();
            } else {
              this.notificationService.showError(response.message);
            }
            this.isLoading = false;
          },
          error: (error) => {
            this.notificationService.showError('Failed to delete car model');
            this.isLoading = false;
          }
        });
      }
    });
  }

  createCarModel(): void {
    this.router.navigate(['/dashboard/cars/create']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
