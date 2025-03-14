import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/response.model';
import { Salesman, SalesmanRequest, SalesRecord, SalesRecordRequest } from '../models/salesman.model';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  private apiUrl = `${environment.apiUrl}/salesman`;

  constructor(private http: HttpClient) { }

  getSalesmen(): Observable<ApiResponse<Salesman[]>> {
    return this.http.get<ApiResponse<Salesman[]>>(this.apiUrl);
  }

  getSalesmanById(id: number): Observable<ApiResponse<Salesman>> {
    return this.http.get<ApiResponse<Salesman>>(`${this.apiUrl}/${id}`);
  }

  createSalesman(salesman: SalesmanRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(this.apiUrl, salesman);
  }

  updateSalesman(id: number, salesman: SalesmanRequest): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/${id}`, salesman);
  }

  getSalesRecords(month?: number, year?: number): Observable<ApiResponse<SalesRecord[]>> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<ApiResponse<SalesRecord[]>>(`${this.apiUrl}/sales`, { params });
  }

  upsertSalesRecord(record: SalesRecordRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/sales`, record);
  }

  populateSampleData(month: number, year: number): Observable<ApiResponse<string>> {
    let params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/populateSampleData`, null, { params });
  }
}
