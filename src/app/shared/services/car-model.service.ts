import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/response.model';
import { Brand, CarModel, CarModelRequest, Class, ImageUploadRequest } from '../models/car-model.model';

@Injectable({
  providedIn: 'root'
})
export class CarModelService {
  private apiUrl = `${environment.apiUrl}/carmodel`;

  constructor(private http: HttpClient) { }

  getCarModels(searchTerm?: string, orderBy?: string): Observable<ApiResponse<CarModel[]>> {
    let params = new HttpParams();
    params= params.set('searchTerm', searchTerm || '');
    if (orderBy) params = params.set('orderBy', orderBy);

    return this.http.get<ApiResponse<CarModel[]>>(this.apiUrl, { params });
  }

  getCarModelById(id: number): Observable<ApiResponse<CarModel>> {
    return this.http.get<ApiResponse<CarModel>>(`${this.apiUrl}/${id}`);
  }

  createCarModel(model: CarModelRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.apiUrl, model);
  }

  updateCarModel(id: number, model: CarModelRequest): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/${id}`, model);
  }

  deleteCarModel(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`);
  }

  uploadImage(modelId: number, image: File, isDefault: boolean): Observable<ApiResponse<number>> {
    const formData = new FormData();
    formData.append('modelId', modelId.toString());
    formData.append('image', image, image.name);
    formData.append('isDefault', isDefault.toString());

    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/image`, formData);
  }

  deleteImage(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/image/${id}`);
  }

  setDefaultImage(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/image/${id}/default`, {});
  }

  getBrands(): Observable<ApiResponse<Brand[]>> {
    return this.http.get<ApiResponse<Brand[]>>(`${this.apiUrl}/brands`);
  }

  getClasses(): Observable<ApiResponse<Class[]>> {
    return this.http.get<ApiResponse<Class[]>>(`${this.apiUrl}/classes`);
  }
}
