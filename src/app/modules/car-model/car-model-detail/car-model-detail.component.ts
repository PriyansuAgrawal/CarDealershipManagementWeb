import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarModelService } from '../../../shared/services/car-model.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CarModel } from '../../../shared/models/car-model.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-car-model-detail',
  templateUrl: './car-model-detail.component.html',
  styleUrls: ['./car-model-detail.component.scss']
})
export class CarModelDetailComponent implements OnInit {
  modelId: number;
  carModel: CarModel | null = null;
  isLoading = false;
  currentImageIndex = 0;
  imageBaseUrl = environment.imageBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carModelService: CarModelService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modelId = +id;
        this.loadCarModel();
      } else {
        this.router.navigate(['/dashboard/cars']);
      }
    });
  }

  loadCarModel(): void {
    this.isLoading = true;
    this.carModelService.getCarModelById(this.modelId).subscribe({
      next: (response) => {
        if (response.success) {
          this.carModel = response.data;
        } else {
          this.notificationService.showError('Failed to load car model details');
          this.router.navigate(['/dashboard/cars']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load car model details');
        this.router.navigate(['/dashboard/cars']);
        this.isLoading = false;
      }
    });
  }

  editCarModel(): void {
    this.router.navigate(['/dashboard/cars/edit', this.modelId]);
  }

  deleteCarModel(): void {
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
        this.carModelService.deleteCarModel(this.modelId).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showSuccess('Car model deleted successfully');
              this.router.navigate(['/dashboard/cars']);
            } else {
              this.notificationService.showError(response.message);
              this.isLoading = false;
            }
          },
          error: () => {
            this.notificationService.showError('Failed to delete car model');
            this.isLoading = false;
          }
        });
      }
    });
  }

  nextImage(): void {
    if (this.carModel && this.carModel.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carModel.images.length;
    }
  }

  prevImage(): void {
    if (this.carModel && this.carModel.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.carModel.images.length) % this.carModel.images.length;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/cars']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
