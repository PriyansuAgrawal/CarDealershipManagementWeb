import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private notificationService: NotificationService) { }
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Could not connect to server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to access this resource.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      }
    }

    this.notificationService.showError(errorMessage);

    return throwError(() => errorMessage);
  }
}
