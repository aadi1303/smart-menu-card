import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, MenuItem } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
  imports: [CommonModule]
})
export class MenuListComponent implements OnInit {
  items = signal<MenuItem[]>([]);
  isLoading = signal(true);

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.isLoading.set(true);
    this.api.getMenuItems().subscribe({
      next: (data) => {
        console.log('Menu items loaded:', data); // Debug log
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load menu items:', err);
        this.isLoading.set(false);
      }
    });
  }

  goToAddItem() {
    this.router.navigate(['/']);
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.api.deleteMenuItem(id).subscribe({
        next: () => {
          // Refresh the list after successful deletion
          this.loadMenuItems();
        },
        error: (err) => console.error('Failed to delete item:', err)
      });
    }
  }
}