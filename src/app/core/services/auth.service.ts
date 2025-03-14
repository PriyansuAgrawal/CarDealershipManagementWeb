import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/response.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../../shared/models/auth.model';
import { StorageService } from './storage.service';
import { MenuItem } from '../../shared/models/menu.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  public currentUser: Observable<LoginResponse | null>;
  private menuSubject: BehaviorSubject<MenuItem[]> = new BehaviorSubject<
    MenuItem[]
  >([]);
  public menu: Observable<MenuItem[]> = this.menuSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(
      this.storageService.getItem('currentUser')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }
  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.storageService.setItem('currentUser', response.data);
            this.currentUserSubject.next(response.data);
            this.loadMenu();
          }
        })
      );
  }
  register(request: RegisterRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.apiUrl}/register`,
      request
    );
  }
  logout(): void {
    this.storageService.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.menuSubject.next([]);
    this.router.navigate(['/auth/login']);
  }
  loadMenu(): Observable<ApiResponse<MenuItem[]>> {
    return this.http.get<ApiResponse<MenuItem[]>>(`${this.apiUrl}/menu`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.menuSubject.next(response.data);
        }
      })
    );
  }
  isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;
    return !!currentUser && !!currentUser.token;
  }
  hasRole(requiredRoles: string[]): boolean {
    const currentUser = this.currentUserValue;
    if (!currentUser) return false;

    return requiredRoles.includes(currentUser.roleName);
  }
}
