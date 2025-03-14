import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CarModelService } from '../../../shared/services/car-model.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() modelId: number;

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private carModelService: CarModelService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      isDefault: [false],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];

      // Validate file size (max 5MB)
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        this.notificationService.showError('File size exceeds 5MB limit');
        this.resetFileInput();
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.notificationService.showError('Only JPG, PNG, and GIF files are allowed');
        this.resetFileInput();
        return;
      }

      // Show preview
      this.createPreview();
    }
  }

  createPreview(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result || null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadForm.get('image')?.reset();
  }

  uploadImage(): void {
    if (!this.selectedFile || !this.modelId) {
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('modelId', this.modelId.toString());
    formData.append('image', this.selectedFile);
    formData.append('isDefault', this.uploadForm.get('isDefault')?.value ? 'true' : 'false');

    this.carModelService.uploadImage(this.modelId, this.selectedFile, this.uploadForm.get('isDefault')?.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Image uploaded successfully');
          this.resetFileInput();
          // Reload car model to refresh images
          window.location.reload();
        } else {
          this.notificationService.showError(response.message);
        }
        this.isUploading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to upload image');
        this.isUploading = false;
      }
    });
  }
  get isDefaultControl(): FormControl {
    return this.uploadForm.get('isDefault') as FormControl;
  }
}
