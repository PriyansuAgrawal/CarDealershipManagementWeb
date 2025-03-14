import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../models/menu.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoading = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.menu.subscribe(menu => {
      this.menuItems = menu;
      this.isLoading = false;
    });

    if (this.authService.isAuthenticated()) {
      this.loadMenu();
    }
  }

  loadMenu(): void {
    this.isLoading = true;
    this.authService.loadMenu().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }
}
