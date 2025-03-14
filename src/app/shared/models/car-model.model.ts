export interface CarModel {
  modelId: number;
  brandId: number;
  brandName: string;
  classId: number;
  className: string;
  modelName: string;
  modelCode: string;
  description: string;
  features: string;
  price: number;
  dateOfManufacturing: Date;
  isActive: boolean;
  sortOrder: number;
  createdDate: Date;
  modifiedDate: Date;
  defaultImage: string;
  images: ModelImage[];
}
export interface ModelImage {
  imageId: number;
  modelId: number;
  imagePath: string;
  isDefault: boolean;
  uploadDate: Date;
}
export interface Brand {
  brandId: number;
  name: string;
}
export interface Class {
  classId: number;
  name: string;
}
export interface CarModelRequest {
  modelId?: number;
  brandId: number;
  classId: number;
  modelName: string;
  modelCode: string;
  description: string;
  features: string;
  price: number;
  dateOfManufacturing: Date;
  isActive: boolean;
  sortOrder: number;
}
export interface ImageUploadRequest {
  modelId: number;
  isDefault: boolean;
  image: File;
}
