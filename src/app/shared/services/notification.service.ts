import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    this.openSnackBar(message, 'success');
  }

  showError(message: string): void {
    this.openSnackBar(message, 'error');
  }

  showInfo(message: string): void {
    this.openSnackBar(message, 'info');
  }

  showWarning(message: string): void {
    this.openSnackBar(message, 'warning');
  }

  private openSnackBar(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: {
        message,
        type
      },
      duration: type === 'error' ? 5000 : 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`${type}-snackbar`]
    });
  }
}
