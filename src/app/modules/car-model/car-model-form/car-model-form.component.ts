import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarModelService } from '../../../shared/services/car-model.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Brand, Class, CarModel } from '../../../shared/models/car-model.model';
import { environment } from '../../../../environments/environment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-car-model-form',
  templateUrl: './car-model-form.component.html',
  styleUrls: ['./car-model-form.component.scss']
})
export class CarModelFormComponent implements OnInit {
  carModelForm!: FormGroup;
  isEditMode = false;
  modelId?: number;
  brands: Brand[] = [];
  classes: Class[] = [];
  carModel?: CarModel;
  isLoading = false;
  isSubmitting = false;
  imageBaseUrl = environment.imageBaseUrl;
  public Editor = ClassicEditor;
  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    height: 300
  };

  constructor(
    private fb: FormBuilder,
    private carModelService: CarModelService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadDropdowns();

    // Check if in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modelId = +id;
        this.isEditMode = true;
        this.loadCarModel(this.modelId);
      }
    });
  }

  createForm(): void {
    this.carModelForm = this.fb.group({
      modelName: ['', Validators.required],
      modelCode: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ]],
      brandId: ['', Validators.required],
      classId: ['', Validators.required],
      description: ['', Validators.required],
      features: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      dateOfManufacturing: ['', Validators.required],
      isActive: [true],
      sortOrder: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadDropdowns(): void {
    this.isLoading = true;

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

  loadCarModel(id: number): void {
    this.isLoading = true;
    this.carModelService.getCarModelById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.carModel = response.data;
          this.patchFormValues();
        } else {
          this.notificationService.showError('Failed to load car model');
          this.router.navigate(['/dashboard/cars']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load car model');
        this.router.navigate(['/dashboard/cars']);
        this.isLoading = false;
      }
    });
  }

  patchFormValues(): void {
    if (this.carModel) {
      this.carModelForm.patchValue({
        modelName: this.carModel.modelName,
        modelCode: this.carModel.modelCode,
        brandId: this.carModel.brandId,
        classId: this.carModel.classId,
        description: this.carModel.description,
        features: this.carModel.features,
        price: this.carModel.price,
        dateOfManufacturing: new Date(this.carModel.dateOfManufacturing),
        isActive: this.carModel.isActive,
        sortOrder: this.carModel.sortOrder
      });
    }
  }

  onSubmit(): void {
    if (this.carModelForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.carModelForm.controls).forEach(key => {
        const control = this.carModelForm.get(key);
        control?.markAsTouched();
      });
      this.notificationService.showError('Please fix the form errors before submitting');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.modelId) {
      // Update existing car model
      const updateData = {
        ...this.carModelForm.value,
        modelId: this.modelId
      };

      this.carModelService.updateCarModel(this.modelId, updateData).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Car model updated successfully');
            this.router.navigate(['/dashboard/cars']);
          } else {
            this.notificationService.showError(response.message);
          }
          this.isSubmitting = false;
        },
        error: (e) => {
          this.notificationService.showError('Failed to update car model');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new car model
      this.carModelService.createCarModel(this.carModelForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Car model created successfully');
            this.router.navigate(['/dashboard/cars/edit', response.data]);
          } else {
            this.notificationService.showError(response.message);
          }
          this.isSubmitting = false;
        },
        error: () => {
          this.notificationService.showError('Failed to create car model');
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/cars']);
  }
}
