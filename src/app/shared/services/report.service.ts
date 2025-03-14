import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommissionReport, CommissionSummary } from '../models/commission.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) { }

  getCommissionReport(month?: number, year?: number): Observable<{
    success: boolean;
    message: string;
    data:{
      details: CommissionReport[];
      summary: CommissionSummary[];
    }

  }> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<{
      success: boolean;
      message: string;
      data:{
        details: CommissionReport[];
        summary: CommissionSummary[];
      }
    }>(`${this.apiUrl}/commission`, { params });
  }
}
